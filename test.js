import test from "node:test"; import assert from "node:assert/strict"; import {newSession,receive} from "./bot.js";
test("completes an English enquiry",()=>{let s=newSession("en");for(const x of ["repair","2","Not cold","Batu Pahat","home","tomorrow","Ziwu"]){s=receive(s,x).session;}const out=receive(s,"yes");assert.equal(out.session.step,"done");assert.match(out.reply.text,/received/i)});
test("restarts in Chinese",()=>{let s=receive(newSession("zh"),"repair").session;const out=receive(s,"重新开始");assert.equal(out.session.step,"service");assert.match(out.reply.text,/您好/)});
