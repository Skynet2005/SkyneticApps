import test from "node:test";
import assert from "node:assert/strict";
import {validEmail,sameOrigin,digestToken,requireJSON,configured} from "../server/core.js";

test("email normalization doesn't accept invalid identities",()=>{
 assert.equal(validEmail(" USER@Example.org "),"user@example.org");
 assert.equal(validEmail("noatsign"),null);
 assert.equal(validEmail("a@b"),null);
 assert.equal(validEmail("x".repeat(255)),null);
});
test("unsafe origins are denied, including missing origin headers",()=>{
 const prior=process.env.PUBLIC_ORIGIN;
 process.env.PUBLIC_ORIGIN="https://commonground-nu.vercel.app";
 try{
  assert.equal(sameOrigin({headers:{origin:"https://commonground-nu.vercel.app"}}),true);
  assert.equal(sameOrigin({headers:{origin:"https://attacker.invalid"}}),false);
  assert.equal(sameOrigin({headers:{}}),false);
 }finally{if(prior===undefined)delete process.env.PUBLIC_ORIGIN;else process.env.PUBLIC_ORIGIN=prior}
});
test("one time token digest depends on private signing pepper",()=>{
 const prior=process.env.AUTH_TOKEN_PEPPER;
 process.env.AUTH_TOKEN_PEPPER="test-hmac-key-not-a-production-secret";
 try{
  const one=digestToken("one-token");
  assert.equal(one.length,64);
  assert.notEqual(one,digestToken("another-token"));
 }finally{if(prior===undefined)delete process.env.AUTH_TOKEN_PEPPER;else process.env.AUTH_TOKEN_PEPPER=prior}
});
test("reject content type confusion and malformed JSON payloads",()=>{
 assert.throws(()=>requireJSON({headers:{"content-type":"text/plain"},body:{}}),/JSON content required/);
 assert.throws(()=>requireJSON({headers:{"content-type":"application/json"},body:[]}),/Invalid JSON object/);
 assert.deepEqual(requireJSON({headers:{"content-type":"application/json"},body:{title:"test"}}),{title:"test"});
});
