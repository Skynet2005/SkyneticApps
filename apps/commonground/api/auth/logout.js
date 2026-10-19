import {reply,failure,method,cookie,digestToken,db,clearSessionCookie,sameOrigin,configured} from "../../server/core.js";
export default async function handler(req,res){
 if(!method(req,res,["POST"]))return;
 try{
  if(configured()&&sameOrigin(req)){
   const token=cookie(req,"cg_session");
   if(token){const p=await db();await p.query("UPDATE app.sessions SET revoked_at=now() WHERE token_digest=$1",[digestToken(token)])}
  }
  clearSessionCookie(res);
  return reply(res,200,{authenticated:false});
 }catch(e){clearSessionCookie(res);return failure(res,e)}
}