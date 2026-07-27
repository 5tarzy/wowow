import { SaveState } from "./types";
const DB_NAME="football-gm-simulator"; const STORE="saves";
export async function saveGame(state:SaveState):Promise<void>{
  const request=indexedDB.open(DB_NAME,1);
  await new Promise<void>((resolve,reject)=>{
    request.onupgradeneeded=()=>request.result.createObjectStore(STORE);
    request.onsuccess=()=>{const db=request.result; const tx=db.transaction(STORE,"readwrite"); tx.objectStore(STORE).put(state,"current"); tx.oncomplete=()=>resolve(); tx.onerror=()=>reject(tx.error);};
    request.onerror=()=>reject(request.error);
  });
}
export async function loadGame():Promise<SaveState|null>{
  return new Promise(resolve=>{const r=indexedDB.open(DB_NAME,1); r.onupgradeneeded=()=>r.result.createObjectStore(STORE); r.onsuccess=()=>{const g=r.result.transaction(STORE,"readonly").objectStore(STORE).get("current"); g.onsuccess=()=>resolve(g.result??null); g.onerror=()=>resolve(null)}; r.onerror=()=>resolve(null)});
}