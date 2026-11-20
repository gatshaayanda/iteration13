"use client";

import { useEffect,useId,useRef,useState } from "react";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { deleteOfflineMedia,saveOfflineMedia,syncOfflineMedia } from "@/lib/offline-media";
import { useOfflineMediaSource } from "@/app/useOfflineMediaSource";

const {useUploadThing}=generateReactHelpers<OurFileRouter>();
type Props={value:string;online:boolean;onChange:(url:string)=>void;onUploadingChange:(uploading:boolean)=>void};

export default function AnnouncementImagePicker({value,online,onChange,onUploadingChange}:Props){
  const inputRef=useRef<HTMLInputElement>(null);
  const attemptedSync=useRef("");
  const onChangeRef=useRef(onChange);
  const instanceId=useId().replace(/:/g,"");
  const fileInputId="announcement-thumbnail-file-"+instanceId;
  const urlInputId="announcement-thumbnail-url-"+instanceId;
  const [message,setMessage]=useState("");
  const [progress,setProgress]=useState(0);
  const previewSource=useOfflineMediaSource(value);
  const {startUpload,isUploading}=useUploadThing("fileUploader",{
    onUploadProgress:next=>setProgress(Math.max(0,Math.min(100,Math.round(next)))),
    onClientUploadComplete:files=>{
      onUploadingChange(false);const file=files?.[0];const url=file?.ufsUrl||file?.url;
      if(!url){setMessage("Upload finished without a usable image URL. Your previous image is unchanged.");return;}
      onChangeRef.current(url);setMessage("Announcement thumbnail uploaded and ready to publish.");setProgress(100);if(inputRef.current)inputRef.current.value="";
    },
    onUploadError:error=>{onUploadingChange(false);setProgress(0);setMessage(error.message||"Image upload failed. Your current thumbnail has been kept.");}
  });
  useEffect(()=>{onChangeRef.current=onChange;},[onChange]);
  useEffect(()=>{
    if(!online||!navigator.onLine){attemptedSync.current="";return;}
    if(!value.startsWith("idb-media://")||isUploading)return;
    const id=value.slice("idb-media://".length);if(attemptedSync.current===id)return;attemptedSync.current=id;
    void syncOfflineMedia(id,async file=>{const uploaded=await startUpload([file]);const result=uploaded?.[0];const url=result?.ufsUrl||result?.url;if(!url)throw new Error("UploadThing did not return a media URL.");return url;})
      .then(url=>{if(url){onChangeRef.current(url);setMessage("Pending thumbnail uploaded and synced successfully.");}})
      .catch(error=>setMessage(error instanceof Error?error.message+" The file remains saved on this device. Reconnect to retry.":"Sync failed. The file remains saved on this device."));
  },[value,online,isUploading,startUpload]);

  async function uploadSelected(event:React.ChangeEvent<HTMLInputElement>){
    const file=event.target.files?.[0];if(!file)return;
    if(!file.type.startsWith("image/")){setMessage("Choose an image file (JPG, PNG or WebP).");event.target.value="";return;}
    if(file.size>4*1024*1024){setMessage("Choose an image smaller than 4 MB.");event.target.value="";return;}
    if(!online||!navigator.onLine){
      try{const saved=await saveOfflineMedia(file);onChange("idb-media://"+saved.id);setMessage("Saved on this device · Pending Sync. Reconnect to publish the thumbnail.");}
      catch(error){setMessage(error instanceof Error?error.message:"Could not save this image offline.");}
      event.target.value="";return;
    }
    onUploadingChange(true);setProgress(0);setMessage("Uploading image… keep this page open until UploadThing confirms it.");
    try{await startUpload([file]);}
    catch{
      onUploadingChange(false);setProgress(0);
      try{const saved=await saveOfflineMedia(file);attemptedSync.current=saved.id;onChange("idb-media://"+saved.id);setMessage("Upload could not finish. Saved on this device · Pending Sync.");}
      catch(error){setMessage(error instanceof Error?error.message:"Image upload failed.");}
    }
  }
  function clearImage(){if(value.startsWith("idb-media://"))void deleteOfflineMedia(value.slice("idb-media://".length));onChange("");setMessage("Thumbnail removed. Publish the announcement to apply the change.");}
  return <fieldset className="sd-announcement-image-picker" disabled={isUploading}>
    <legend>Announcement thumbnail <span className="sd-optional">OPTIONAL</span></legend>
    <p className="sd-admin-help">A small, relevant image helps customers recognise your update. Keep the main subject near the centre so it still looks clear when cropped.</p>
    <div className="sd-announcement-image-options">
      <div className="sd-announcement-upload-choice">
        <label className="sd-announcement-upload-action" htmlFor={fileInputId}><span aria-hidden="true">↑</span>{value?"Replace image":"Choose an image"}</label>
        <input ref={inputRef} className="sd-announcement-file-input" id={fileInputId} type="file" accept="image/*" onChange={uploadSelected}/>
        <small>JPG, PNG or WebP · max 4 MB</small>
      </div>
      <span className="sd-announcement-or" aria-hidden="true">OR</span>
      <label className="sd-announcement-url-choice" htmlFor={urlInputId}>Paste an image link<input id={urlInputId} type="url" value={value.startsWith("idb-media://")?"":value} onChange={event=>{onChange(event.target.value);setMessage("");}} placeholder="https://…/image.jpg"/></label>
    </div>
    {!online&&<small className="sd-media-offline">Offline: selected images are saved on this device and marked Pending Sync.</small>}
    {!value&&!isUploading&&<small className="sd-announcement-no-image">No thumbnail added. That’s fine — this image is optional.</small>}
    {isUploading&&<div className="sd-media-progress" role="status" aria-live="polite"><div className="sd-media-progress-copy"><strong>Uploading thumbnail</strong><span>{progress}%</span></div><div className="sd-media-progress-track" role="progressbar" aria-label="Thumbnail upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{width:progress+"%"}}/></div></div>}
    {message&&<p className="sd-media-status" role="status">{message}</p>}
    {value&&<div className="sd-announcement-image-current"><small>{value.startsWith("idb-media://")?"Saved on this device · Pending Sync":"Current thumbnail"}</small><img src={previewSource} alt="Announcement thumbnail preview" onError={event=>{event.currentTarget.style.display="none";}}/><button type="button" onClick={clearImage}>Remove thumbnail</button></div>}
  </fieldset>;
}
