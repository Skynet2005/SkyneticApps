import test from "node:test";
import assert from "node:assert/strict";
import {STARTER_CASES,caseChecks,scoreCase,safeImport} from "../src/engine.js";

test("procedural checks have five stable items",()=>{const checks=caseChecks(STARTER_CASES[0]);assert.equal(checks.length,5);assert.equal(checks[0].id,"authority");});
test("filled fields increase coverage",()=>{const c={...STARTER_CASES[0],rule:"Declaration, §2",independent:true};assert.equal(scoreCase(c),100);});
test("unsubstantiated case never receives full coverage",()=>{assert.ok(scoreCase({...STARTER_CASES[0],rule:"",evidence:"",responded:false,independent:false,resolution:""})<100);});
test("workspace import is bounded",()=>{assert.equal(safeImport({cases:null}),null);assert.equal(safeImport({cases:Array(501).fill({})}),null);});
test("safe import preserves ordinary cases without accepting arbitrary properties",()=>{const result=safeImport({cases:[{id:"1",title:"Test",ignored:"secret"}]});assert.equal(result.length,1);assert.equal("ignored" in result[0],false);});
