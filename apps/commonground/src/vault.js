
// Local encrypted evidence vault. No bytes or passphrases are sent over the network.
// Authenticated encryption detects accidental or malicious ciphertext modification;
// it does NOT prove that an uploaded document was truthful or independently verified.
const DB_NAME="commonground-vault-v1";
const STORE="evidence";
const ITERATIONS=600000;
export const MAX_FILE_BYTES=8*1024*1024;
export const VAULT_NOTICE="Files are encrypted on this device only. Losing the passphrase or browser data can make them unrecoverable. This is not independently verified legal evidence custody.";
const enc=new TextEncoder(), dec=new TextDecoder();
function bytes(x){return x instanceof Uint8Array?x:new Uint8Array(x)}
function newSalt(n){return crypto.getRandomValues(new Uint8Array(n))}
function toHex(x){return [...new Uint8Array(x)].map(b=>b.toString(16).padStart(2,"0")).join("")}
function requirePhrase(passphrase){if(typeof passphrase!=="string"||passphrase.length<12||passphrase.length>512)throw Error("Use a passphrase of at least 12 characters.");}
async function derive(passphrase,salt){
 requirePhrase(passphrase);
 const base=await crypto.subtle.importKey("raw",enc.encode(passphrase),"PBKDF2",false,["deriveKey"]);
 return crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:ITERATIONS,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
}
export async function sealEvidence(fileData,filename,mimeType,passphrase){
 const data=bytes(fileData);
 if(data.byteLength===0||data.byteLength>MAX_FILE_BYTES)throw Error("File must be between 1 byte and 8 MB.");
 if(!filename||filename.length>255)throw Error("File name must be between 1 and 255 characters.");
 const salt=newSalt(16),bodyIv=newSalt(12),metaIv=newSalt(12);
 const key=await derive(passphrase,salt);
 const digest=toHex(await crypto.subtle.digest("SHA-256",data));
 const meta=enc.encode(JSON.stringify({filename,mimeType:String(mimeType||"application/octet-stream").slice(0,150),sha256:digest}));
 const [body,header]=await Promise.all([
   crypto.subtle.encrypt({name:"AES-GCM",iv:bodyIv},key,data),
   crypto.subtle.encrypt({name:"AES-GCM",iv:metaIv},key,meta)
 ]);
 return {version:1,salt,bodyIv,metaIv,body:bytes(body),header:bytes(header),size:data.byteLength};
}
export async function openEvidence(record,passphrase){
 if(record?.version!==1)throw Error("Unsupported evidence format.");
 const key=await derive(passphrase,bytes(record.salt));
 try{
  const [plain,metadata]=await Promise.all([
   crypto.subtle.decrypt({name:"AES-GCM",iv:bytes(record.bodyIv)},key,bytes(record.body)),
   crypto.subtle.decrypt({name:"AES-GCM",iv:bytes(record.metaIv)},key,bytes(record.header))
  ]);
  const info=JSON.parse(dec.decode(metadata));
  const calculated=toHex(await crypto.subtle.digest("SHA-256",plain));
  if(calculated!==info.sha256)throw Error("Evidence integrity check failed.");
  return {data:bytes(plain),filename:info.filename,mimeType:info.mimeType,sha256:calculated};
 }catch{throw Error("Unable to decrypt or verify this item. Check the passphrase and the saved file.");}
}
function dbOpen(){
 if(typeof indexedDB==="undefined")return Promise.reject(Error("IndexedDB is unavailable in this browser."));
 return new Promise((resolve,reject)=>{
  const req=indexedDB.open(DB_NAME,1);
  req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE)){const store=db.createObjectStore(STORE,{keyPath:"id"});store.createIndex("caseId","caseId");}};
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>reject(req.error||Error("Evidence database could not be opened."));
 });
}
async function transaction(mode,operation){
 const db=await dbOpen();
 try{return await new Promise((resolve,reject)=>{
   const t=db.transaction(STORE,mode);
   const store=t.objectStore(STORE);
   let result;
   const req=operation(store);
   req.onsuccess=()=>{result=req.result;};
   t.oncomplete=()=>resolve(result);
   t.onerror=()=>reject(t.error||Error("Evidence storage failed."));
   t.onabort=()=>reject(t.error||Error("Evidence storage was interrupted."));
 })}finally{db.close();}
}
export async function listEvidence(caseId){
 const rows=await transaction("readonly",store=>caseId?store.index("caseId").getAll(caseId):store.getAll());
 return rows.map(x=>({id:x.id,caseId:x.caseId,createdAt:x.createdAt,size:x.size})).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
}
export async function addEvidence(file,passphrase,caseId){
 if(!file || file.size>MAX_FILE_BYTES||file.size<1)throw Error("Choose a file from 1 byte to 8 MB.");
 const data=new Uint8Array(await file.arrayBuffer());
 const sealed=await sealEvidence(data,file.name,file.type,passphrase);
 const record={...sealed,id:crypto.randomUUID(),caseId:String(caseId||"unassigned").slice(0,160),createdAt:new Date().toISOString()};
 await transaction("readwrite",store=>store.put(record));
 return {id:record.id,size:record.size,createdAt:record.createdAt,caseId:record.caseId};
}
export async function retrieveEvidence(id,passphrase){
 const row=await transaction("readonly",store=>store.get(id));
 if(!row)throw Error("File not found on this device.");
 return openEvidence(row,passphrase);
}
export async function removeEvidence(id){await transaction("readwrite",store=>store.delete(id));}
export function downloadEvidence({filename,mimeType,data}){
 const safeName=String(filename||"evidence.bin").split(/[\\/]/).at(-1).replace(/[\u0000-\u001f]/g,"_")||"evidence.bin";
 const blob=new Blob([bytes(data)],{type:mimeType||"application/octet-stream"});
 const url=URL.createObjectURL(blob);
 const a=document.createElement("a");a.href=url;a.download=safeName;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),5000);
}
