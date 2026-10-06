import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { newSession, startMessage, receive } from "./bot.js";

const sessions=new Map();
const types={".html":"text/html",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml"};
const json=(res,status,body)=>{res.writeHead(status,{"content-type":"application/json"});res.end(JSON.stringify(body));};

const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,"http://localhost");
  if(req.method==="POST"&&url.pathname==="/api/demo"){
    let body=""; for await(const chunk of req) body+=chunk;
    const {sessionId="demo",message,lang="en",reset=false}=JSON.parse(body||"{}");
    if(reset||!sessions.has(sessionId)){const s=newSession(lang);sessions.set(sessionId,s);return json(res,200,{session:s,reply:startMessage(lang)});}
    const out=receive(sessions.get(sessionId),message);sessions.set(sessionId,out.session);return json(res,200,out);
  }
  // Meta verification endpoint. Set VERIFY_TOKEN before connecting the webhook.
  if(req.method==="GET"&&url.pathname==="/webhook"&&url.searchParams.get("hub.verify_token")===process.env.VERIFY_TOKEN){res.end(url.searchParams.get("hub.challenge"));return;}
  // Production TODO: parse Meta messages, call receive(), then POST the reply to Graph API.
  if(req.method==="POST"&&url.pathname==="/webhook"){json(res,200,{received:true});return;}
  let path=url.pathname==="/"?"/index.html":url.pathname;
  try{const data=await readFile(join(process.cwd(),"public",path));res.writeHead(200,{"content-type":types[extname(path)]||"application/octet-stream"});res.end(data);}catch{res.writeHead(404);res.end("Not found");}
});
server.listen(process.env.PORT||3000,()=>console.log("Aircon bot demo: http://localhost:"+(process.env.PORT||3000)));
