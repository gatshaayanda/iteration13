"use client";

import { useEffect, useRef, useState } from "react";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { deleteOfflineMedia, saveOfflineMedia, syncOfflineMedia } from "@/lib/offline-media";
import { useOfflineMediaSource } from "@/app/useOfflineMediaSource";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();
type Props = { value:string; type:"image"|"video"; online:boolean; onChange:(url:string,type:"image"|"video")=>void; onUploadingChange:(uploading:boolean)=>void; allowVideo?:boolean };

export default function ServiceMediaPicker({value,type,online,onChange,onUploadingChange,allowVideo=true}:Props) {
  const inputRef=useRef<HTMLInputElement>(null);
  const attemptedSync=useRef("");
  const onChangeRef=useRef(onChange);
  const [message,setMessage]=useState("");
  const [uploadProgress,setUploadProgress]=useState(0);
  const [urlDraft,setUrlDraft]=useState(type==="video"&&!value.startsWith("idb-media://")?value:"");
  const previewSource=useOfflineMediaSource(value);
  const {startUpload,isUploading}=useUploadThing("fileUploader",{
    onUploadProgress:progress=>setUploadProgress(Math.max(0,Math.min(100,Math.round(progress)))),
    onClientUploadComplete:files=>{
      onUploadingChange(false);
      const file=files?.[0];const url=file?.ufsUrl||file?.url;
      if(!url){setMessage("Upload finished but no media URL was returned. Your current media has been kept.");return;}
      const mediaType=file.type.startsWith("video/")?"video":"image";
      onChangeRef.current(url,mediaType);setUrlDraft(mediaType==="video"?url:"");
      setMessage(mediaType==="video"?"Video uploaded and ready to preview.":"Image uploaded and ready to preview.");
      setUploadProgress(100);window.setTimeout(()=>setUploadProgress(0),900);
      if(inputRef.current)inputRef.current.value="";
    },
    onUploadError:error=>{onUploadingChange(false);setUploadProgress(0);setMessage(error.message||"Upload failed. Your current media has been kept.");}
  });
  useEffect(()=>{onChangeRef.current=onChange;},[onChange]);
  useEffect(()=>{
    if(!online||!navigator.onLine){attemptedSync.current="";return;}
    if(!value.startsWith("idb-media://")||isUploading)return;
    const id=value.slice("idb-media://".length);if(attemptedSync.current===id)return;attemptedSync.current=id;
    void syncOfflineMedia(id,async file=>{
      const uploaded=await startUpload([file]);const result=uploaded?.[0];const url=result?.ufsUrl||result?.url;
      if(!url)throw new Error("UploadThing did not return a media URL.");return url;
    }).then(url=>{if(url){onChangeRef.current(url,type);setUrlDraft(type==="video"?url:"");setMessage("Pending media uploaded and synced successfully.");}})
      .catch(error=>setMessage(error instanceof Error?error.message+" Your file remains saved on this device. Reconnect to retry.":"Sync failed. Your file remains saved on this device."));
  },[value,online,isUploading,startUpload,type]);

  async function uploadSelected(event:React.ChangeEvent<HTMLInputElement>) {
    const file=event.target.files?.[0];if(!file)return;
    const expected=type==="video"?file.type.startsWith("video/"):file.type.startsWith("image/");
    const maxBytes=type==="video"?16*1024*1024:4*1024*1024;const maxLabel=type==="video"?"16 MB":"4 MB";
    if(!expected){setMessage(type==="video"?"Choose a video file.":"Choose an image file.");event.target.value="";return;}
    if(file.size>maxBytes){setMessage(file.name+" is "+(file.size/(1024*1024)).toFixed(1)+" MB. The maximum for "+type+"s is "+maxLabel+". Choose a smaller file.");event.target.value="";return;}
    if(!online||!navigator.onLine){
      try{const saved=await saveOfflineMedia(file);onChange("idb-media://"+saved.id,type);setMessage("Saved on this device · Pending Sync. Reconnect to upload this file.");}
      catch(error){setMessage(error instanceof Error?error.message:"Could not save this file offline.");}
      event.target.value="";return;
    }
    onUploadingChange(true);setUploadProgress(0);setMessage("Uploading… keep this page open until UploadThing confirms it.");
    try{await startUpload([file]);}
    catch{
      onUploadingChange(false);setUploadProgress(0);
      try{const saved=await saveOfflineMedia(file);attemptedSync.current=saved.id;onChange("idb-media://"+saved.id,type);setMessage("Upload could not finish. Saved on this device · Pending Sync.");}
      catch(error){setMessage(error instanceof Error?error.message:"Upload failed. Your current media has been kept.");}
    }
  }
  function applyVideoUrl(){
    const candidate=urlDraft.trim();
    try{const parsed=new URL(candidate);if(parsed.protocol!=="https:"&&parsed.protocol!=="http:")throw new Error("Unsupported protocol");onChange(candidate,"video");setMessage("Video link applied. Check the preview before saving the service.");}
    catch{setMessage("Enter a complete video URL beginning with https:// or http://.");}
  }
  function clearMedia(){if(value.startsWith("idb-media://"))void deleteOfflineMedia(value.slice("idb-media://".length));onChange("",type);setUrlDraft("");setMessage("Media cleared. Save the service to remove it from the storefront.");}

  return <fieldset className="sd-media-picker" disabled={isUploading}>
    <legend>Service media</legend>
    <p className="sd-media-help">Add a product photo or a short video preview. Images and videos selected offline are saved on this device, then synced when you reconnect.</p>
    <div className="sd-media-mode" role="group" aria-label="Media type">
      <button type="button" className={type==="image"?"is-selected":""} onClick={()=>{if(value.startsWith("idb-media://"))void deleteOfflineMedia(value.slice("idb-media://".length));onChange("","image");setUrlDraft("");setMessage("Media type changed to image. Select an image.");}}>Image</button>
      {allowVideo&&<button type="button" className={type==="video"?"is-selected":""} onClick={()=>{if(value.startsWith("idb-media://"))void deleteOfflineMedia(value.slice("idb-media://".length));onChange("","video");setUrlDraft("");setMessage("Media type changed to video. Select a video or add its URL.");}}>Video</button>}
    </div>
    {type==="image"?<div className="sd-media-upload">
      <label className="sd-media-file-label" htmlFor="service-media-file">Choose an image from your device · max 4 MB</label>
      <input ref={inputRef} id="service-media-file" type="file" accept="image/*" onChange={uploadSelected} disabled={isUploading}/>
      <small>Offline selections are stored locally and marked Pending Sync. They are not published until UploadThing confirms the upload.</small>
      {!online&&<p className="sd-media-offline">Offline: selected files are saved on this device and marked Pending Sync.</p>}
      <label className="sd-media-url-label" htmlFor="service-image-url">Or use an existing image URL</label>
      <input id="service-image-url" type="url" value={value.startsWith("idb-media://")?"":value} onChange={event=>{onChange(event.target.value,"image");setMessage("");}} placeholder="https://…/image.jpg"/>
    </div>:<div className="sd-media-upload">
      <label className="sd-media-file-label" htmlFor="service-media-file">Choose a video from your device · max 16 MB</label>
      <input ref={inputRef} id="service-media-file" type="file" accept="video/*" onChange={uploadSelected} disabled={isUploading}/>
      <small>Offline video files are stored on this device and can be previewed here. Cloud playback requires a completed UploadThing sync.</small>
      {!online&&<p className="sd-media-offline">Offline: selected files are saved on this device and marked Pending Sync.</p>}
      <label className="sd-media-url-label" htmlFor="service-video-url">Video URL</label>
      <div className="sd-media-url-row"><input id="service-video-url" type="url" value={urlDraft} onChange={event=>setUrlDraft(event.target.value)} placeholder="https://…/video.mp4"/><button type="button" onClick={applyVideoUrl}>Use URL</button></div>
    </div>}
    {isUploading&&<div className="sd-media-progress" role="status" aria-live="polite"><div className="sd-media-progress-copy"><strong>Uploading media</strong><span>{uploadProgress}%</span></div><div className="sd-media-progress-track" role="progressbar" aria-label="Media upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={uploadProgress}><span style={{width:uploadProgress+"%"}}/></div><small>Keep this page open until UploadThing confirms the upload.</small></div>}
    {message&&<p className="sd-media-status" role="status">{message}</p>}
    {value&&<div className="sd-media-preview"><span>PREVIEW · {type.toUpperCase()}{value.startsWith("idb-media://")?" · SAVED ON THIS DEVICE · PENDING SYNC":""}</span>{type==="video"?<video src={previewSource} controls muted playsInline preload="metadata"/>:<img src={previewSource} alt="Selected service media preview" onError={event=>{event.currentTarget.style.display="none";}}/>}<button type="button" onClick={clearMedia}>Remove media</button></div>}
  </fieldset>;
}
