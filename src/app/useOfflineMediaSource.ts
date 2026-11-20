"use client";
import {useEffect,useState} from "react";
import {getOfflineMedia} from "@/lib/offline-media";
export function useOfflineMediaSource(source:string):string{const[resolved,setResolved]=useState(source);useEffect(()=>{let active=true,objectUrl="";if(!source.startsWith("idb-media://")){setResolved(source);return()=>{active=false;};}setResolved("");void getOfflineMedia(source.slice("idb-media://".length)).then(record=>{if(!active||!record)return;if(record.status==="synced"&&record.remoteUrl&&navigator.onLine){setResolved(record.remoteUrl);return;}objectUrl=URL.createObjectURL(record.file);setResolved(objectUrl);}).catch(()=>{if(active)setResolved("");});return()=>{active=false;if(objectUrl)URL.revokeObjectURL(objectUrl);};},[source]);return resolved;}
