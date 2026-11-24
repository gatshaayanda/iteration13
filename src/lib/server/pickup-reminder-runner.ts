import {cert,initializeApp,getApps} from "firebase-admin/app";
import {getFirestore, type DocumentReference} from "firebase-admin/firestore";
import type {MulticastMessage} from "firebase-admin/messaging";
import {getMessaging} from "firebase-admin/messaging";
import {getAuth} from "firebase-admin/auth";

if(!getApps().length){
  const raw=process.env.FIREBASE_ADMIN_KEY;
  if(raw){
    let credential;
    try{credential=cert(JSON.parse(raw));}
    catch{throw new Error("FIREBASE_ADMIN_KEY is not valid JSON.");}
    initializeApp({credential});
  }else{
    initializeApp();
  }
}

const db=getFirestore();
const messaging=getMessaging();
const GABORONE_OFFSET="+02:00";

type ReminderOrder={id:string;scheduledFor?:unknown;status?:unknown;customerId?:unknown;customerName?:string;items?:unknown};
type NotificationToken={id:string;ref:DocumentReference;token:string};
type NotificationResult={sent:boolean;reason?:string;successCount?:number;failureCount?:number};

function parseScheduledFor(value:unknown):number{
  if(typeof value!=="string")return NaN;
  const hasOffset=/[zZ]|[+-]\d{2}:?\d{2}$/.test(value);
  const normalized=hasOffset?value:value+GABORONE_OFFSET;
  const time=Date.parse(normalized);
  return Number.isFinite(time)?time:NaN;
}

const INVALID_TOKEN_CODES=new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token"
]);

async function tokensFor(uid:string):Promise<NotificationToken[]>{
  const snapshot=await db.collection("notificationTokens").doc(uid).collection("tokens").get();
  return snapshot.docs
    .map(doc=>({id:doc.id,ref:doc.ref,...doc.data()} as NotificationToken))
    .filter(item=>typeof item.token==="string"&&item.token);
}

async function sendToUser(uid:string,message:Omit<MulticastMessage,"tokens">):Promise<NotificationResult>{
  const tokens=await tokensFor(uid);
  if(!tokens.length)return {sent:false,reason:"no-token"};

  const response=await messaging.sendEachForMulticast({
    ...message,
    tokens:tokens.map(item=>item.token)
  });

  await Promise.all(response.responses.map((result,index)=>{
    if(result.success||!result.error?.code||!INVALID_TOKEN_CODES.has(result.error.code))return Promise.resolve();
    return tokens[index].ref.delete();
  }));

  return {
    sent:response.successCount>0,
    successCount:response.successCount,
    failureCount:response.failureCount
  };
}

async function sendToDeviceToken(uid:string,token:string,message:Omit<MulticastMessage,"tokens">):Promise<NotificationResult>{
  const tokens=await tokensFor(uid);
  if(!tokens.some(item=>item.token===token))return {sent:false,reason:"device-token-not-registered"};
  const response=await messaging.sendEachForMulticast({...message,tokens:[token]});
  return {sent:response.successCount>0,successCount:response.successCount,failureCount:response.failureCount};
}

async function claimDelivery(jobId:string,data:Record<string,unknown>):Promise<boolean>{
  const ref=db.collection("notificationDeliveries").doc(jobId);
  return db.runTransaction(async transaction=>{
    const snapshot=await transaction.get(ref);
    if(snapshot.exists)return false;
    transaction.create(ref,{
      ...data,
      status:"sending",
      claimedAt:new Date().toISOString()
    });
    return true;
  });
}

async function markSent(jobId:string,data:Record<string,unknown>):Promise<void>{
  await db.collection("notificationDeliveries").doc(jobId).set({
    ...data,
    status:"sent",
    sentAt:new Date().toISOString()
  },{merge:true});
}

async function releaseDelivery(jobId:string):Promise<void>{
  await db.collection("notificationDeliveries").doc(jobId).delete();
}

async function sendTestNotification(uid:string,deviceToken:string):Promise<NotificationResult>{
  const [userRecord,adminSnapshot]=await Promise.all([
    getAuth().getUser(uid),
    db.collection("admins").doc(uid).get()
  ]);
  const displayName=(userRecord.displayName||"").trim();
  const firstName=displayName.split(/\s+/)[0]||"there";
  const isOperationsAdmin=adminSnapshot.exists&&["owner","staff"].includes(String(adminSnapshot.data()?.role||"").toLowerCase());
  const title=isOperationsAdmin?"Business operations alerts are on":"Business notifications are on";
  const body=isOperationsAdmin
    ? "This device is ready for business updates."
    : "Hi "+firstName+", this device is ready for your business notifications.";
  const link=isOperationsAdmin?"/admin":"/account";
  const result=await sendToDeviceToken(uid,deviceToken,{
    notification:{title,body},
    data:{title,body,link,test:"true"},
    webpush:{
      fcmOptions:{link:(process.env.NEXT_PUBLIC_BASE_URL||"https://iteration13.example")+link},
      notification:{tag:"iteration13-test-notification",icon:"/iteration13-icon.svg",badge:"/iteration13-icon.svg"}
    }
  });
  if(!result.sent)throw new Error(result.reason||"no-token");
  return result;
}


async function sendNewOrderNotifications(orderId:string,customerUid:string):Promise<{sent:number;admins:number}>{
  const orderSnapshot=await db.collection("orders").doc(orderId).get();
  if(!orderSnapshot.exists)throw new Error("Order not found.");
  const order={id:orderSnapshot.id,...orderSnapshot.data()} as ReminderOrder & {total?:unknown;mode?:unknown};
  if(order.customerId!==customerUid)throw new Error("Order does not belong to this customer.");
  const adminsSnapshot=await db.collection("admins").get();
  let sent=0,admins=0;
  const items=(Array.isArray(order.items)?order.items:[]).map(item=>item.quantity+"× "+item.name).join(" · ");
  const scheduledTime=parseScheduledFor(order.scheduledFor);
  const timeText=Number.isFinite(scheduledTime)?new Intl.DateTimeFormat("en-GB",{timeStyle:"short",timeZone:"Africa/Gaborone"}).format(new Date(scheduledTime)):"scheduled time";
  const customerName=(order.customerName||"customer").trim();
  const title="New order · "+customerName;
  const body=items+(typeof order.total==="number"?" · P"+order.total.toFixed(2):"")+" · "+(order.mode==="delivery"?"Delivery":"Pickup")+" "+timeText;
  const publicUrl=process.env.NEXT_PUBLIC_BASE_URL||"https://iteration13.example";
  for(const adminDoc of adminsSnapshot.docs){
    const uid=adminDoc.id; const pref=(await db.collection("notificationPreferences").doc(uid).get()).data();
    if(!pref?.enabled)continue; admins++;
    const jobId="new-order_"+orderId+"_"+uid; const deliveryData={orderId,recipientUid:uid,type:"new-order",admin:true};
    if(!await claimDelivery(jobId,deliveryData))continue;
    try{
      const result=await sendToUser(uid,{notification:{title,body},data:{title,body,link:"/admin",orderId},webpush:{fcmOptions:{link:publicUrl+"/admin"},notification:{tag:"iteration13-new-order-"+orderId,icon:"/iteration13-icon.svg",badge:"/iteration13-icon.svg"}}});
      if(result.sent){await markSent(jobId,deliveryData);sent++;}else await releaseDelivery(jobId);
    }catch(error){await releaseDelivery(jobId).catch(()=>{});console.error("New-order notification failed for "+uid+":",error);}
  }
  return {sent,admins};
}


async function sendConversationMessageNotification(conversationId:string,messageId:string,senderUid:string):Promise<{sent:number;recipient:string}>{
  const conversationSnapshot=await db.collection("conversations").doc(conversationId).get();
  const messageSnapshot=await db.collection("conversations").doc(conversationId).collection("messages").doc(messageId).get();
  if(!conversationSnapshot.exists||!messageSnapshot.exists)throw new Error("Conversation message not found.");
  const conversation=conversationSnapshot.data() as Record<string,unknown>;
  const message=messageSnapshot.data() as Record<string,unknown>;
  if(message.senderId!==senderUid)throw new Error("Message does not belong to this sender.");
  const senderRole=String(message.senderRole||"");
  const customerId=String(conversation.customerId||"");
  const adminSnapshot=await db.collection("admins").doc(senderUid).get();
  const senderIsAdmin=adminSnapshot.exists&&["owner","staff"].includes(String(adminSnapshot.data()?.role||"").toLowerCase());
  if(senderRole==="customer"&&(customerId!==senderUid||senderIsAdmin))throw new Error("Customer message authorization failed.");
  if(senderRole==="admin"&&!senderIsAdmin)throw new Error("Admin message authorization failed.");
  const recipientUids:string[]=[];
  if(senderRole==="customer"){
    const admins=await db.collection("admins").get();
    for(const admin of admins.docs){
      const pref=(await db.collection("notificationPreferences").doc(admin.id).get()).data();
      if(pref?.enabled)recipientUids.push(admin.id);
    }
  }else{
    if(customerId)recipientUids.push(customerId);
  }
  const customerName=String(conversation.customerName||"customer").trim();
  const title=senderRole==="customer"?customerName+" sent a message":"Your business replied to you";
  const preview=String(message.text||"Attachment sent");
  const body=preview.length>120?preview.slice(0,117)+"…":preview;
  const link=senderRole==="customer"?"/admin":"/account";
  const publicUrl=process.env.NEXT_PUBLIC_BASE_URL||"https://iteration13.example";
  let sent=0;
  for(const uid of recipientUids){
    const jobId="conversation-message_"+conversationId+"_"+messageId+"_"+uid;
    const deliveryData={conversationId,messageId,recipientUid:uid,type:"conversation-message"};
    if(!await claimDelivery(jobId,deliveryData))continue;
    try{
      const result=await sendToUser(uid,{notification:{title,body},data:{title,body,link,conversationId,messageId},webpush:{fcmOptions:{link:publicUrl+link},notification:{tag:"iteration13-conversation-"+conversationId,icon:"/iteration13-icon.svg",badge:"/iteration13-icon.svg"}}});
      if(result.sent){await markSent(jobId,deliveryData);sent++;}else await releaseDelivery(jobId);
    }catch(error){await releaseDelivery(jobId).catch(()=>{});console.error("Conversation notification failed for "+uid+":",error);}
  }
  return {sent,recipient:senderRole==="customer"?"operations":"customer"};
}

export {sendTestNotification,sendNewOrderNotifications,sendConversationMessageNotification};
