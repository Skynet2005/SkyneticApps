import {db,reply,failure,method,requireJSON,sameOrigin,digestToken,randomToken,setSessionCookie,configured,mailConfigured} from "../../server/core.js";
export default async function handler(req,res){
 if(!method(req,res,["POST"]))return;
 try{
  if(!configured()||!mailConfigured()||process.env.SHARED_BETA_ENABLED!=="true")return reply(res,503,{error:"Shared accounts are not enabled"});
  if(!sameOrigin(req))return reply(res,403,{error:"Request origin not permitted"});
  const token=requireJSON(req,2000).token;
  if(typeof token!=="string"||!(/^[A-Za-z0-9_-]{40,100}$/.test(token)))return reply(res,400,{error:"Invalid sign-in link"});
  const p=await db(),client=await p.connect();
  try{
   await client.query("BEGIN");
   const found=await client.query(`SELECT id,email FROM app.login_tokens WHERE token_digest=$1
    AND consumed_at IS NULL AND expires_at>now() FOR UPDATE`,[digestToken(token)]);
   if(!found.rowCount){await client.query("ROLLBACK");return reply(res,401,{error:"Link expired or already used"});}
   const tokenRow=found.rows[0];
   const user=await client.query("SELECT app.upsert_verified_account($1) AS id",[tokenRow.email]);
   const sessionToken=randomToken();
   await client.query(`INSERT INTO app.sessions(account_id,token_digest,expires_at)
     VALUES ($1,$2,now()+interval '14 days')`,[user.rows[0].id,digestToken(sessionToken)]);
   await client.query("UPDATE app.login_tokens SET consumed_at=now() WHERE id=$1",[tokenRow.id]);
   await client.query("COMMIT");
   setSessionCookie(res,sessionToken);
   return reply(res,200,{authenticated:true,email:tokenRow.email});
  }catch(e){await client.query("ROLLBACK").catch(()=>{});throw e}finally{client.release()}
 }catch(e){return failure(res,e)}
}