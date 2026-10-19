import {db,reply,failure,method,requireJSON,sameOrigin,validEmail,randomToken,digestToken,fingerprint,mailConfigured,safeOrigin,configured} from "../../server/core.js";
export default async function handler(req,res){
 if(!method(req,res,["POST"]))return;
 try{
  if(!configured()||!mailConfigured()||process.env.SHARED_BETA_ENABLED!=="true")return reply(res,503,{error:"Shared accounts are not enabled"});
  if(!sameOrigin(req))return reply(res,403,{error:"Request origin not permitted"});
  const email=validEmail(requireJSON(req,2000).email);
  if(!email)return reply(res,400,{error:"Enter a valid email address"});
  const p=await db(),ipKey=fingerprint(req);
  const recent=await p.query(`SELECT
    (SELECT count(*)::int FROM app.login_tokens WHERE email=$1 AND created_at>now()-interval '15 minutes') AS email_count,
    (SELECT count(*)::int FROM app.login_tokens WHERE request_fingerprint=$2 AND created_at>now()-interval '15 minutes') AS ip_count`,[email,ipKey]);
  if(recent.rows[0].email_count>=3 || recent.rows[0].ip_count>=10)return reply(res,202,{message:"If allowed, a sign-in link will be sent."});
  const token=randomToken(),hash=digestToken(token);
  const result=await p.query(`INSERT INTO app.login_tokens(email,token_digest,request_fingerprint,expires_at)
   VALUES ($1,$2,$3,now()+interval '15 minutes') RETURNING id`,[email,hash,ipKey]);
  const url=new URL(safeOrigin(req));url.hash="auth_code="+encodeURIComponent(token);
  try{
   const sent=await fetch("https://api.resend.com/emails",{
    method:"POST",headers:{"Authorization":"Bearer "+process.env.RESEND_API_KEY,"Content-Type":"application/json"},
    body:JSON.stringify({from:process.env.EMAIL_FROM,to:[email],subject:"Your CommonGround sign-in link",
      text:"Use this private, one-time link to sign in to CommonGround. It expires in 15 minutes.\n\n"+url.toString()+"\n\nIf you didn't ask for it, ignore this email."}),
    signal:AbortSignal.timeout(8000)
   });
   if(!sent.ok)throw new Error("Email provider failed");
  }catch{
   await p.query("DELETE FROM app.login_tokens WHERE id=$1",[result.rows[0].id]).catch(()=>{});
   return reply(res,503,{error:"Sign-in email service is unavailable"});
  }
  return reply(res,202,{message:"If allowed, a sign-in link will be sent."});
 }catch(e){return failure(res,e)}
}