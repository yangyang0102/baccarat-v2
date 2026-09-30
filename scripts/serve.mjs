import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
const root = new URL("../dist/", import.meta.url).pathname;
const types = {".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".webmanifest":"application/manifest+json"};
http.createServer(async (req,res)=>{
  try{
    const path = req.url === "/" ? "/index.html" : req.url?.split("?")[0] || "/index.html";
    const file = join(root, normalize(path).replace(/^([.][.][/\\])+/, ""));
    const data = await readFile(file);
    res.writeHead(200,{"Content-Type":types[extname(file)]||"application/octet-stream"});
    res.end(data);
  }catch{res.writeHead(404);res.end("Not found");}
}).listen(4173,"127.0.0.1",()=>console.log("http://127.0.0.1:4173"));
