// Compatibility port. The backend serves only dist/ and intentional uploads.
import http from 'node:http';
const port = Number(process.env.WEB_PORT || 5174);
http.createServer((req,res) => {
 const upstream = http.request({hostname:'127.0.0.1',port:Number(process.env.API_PORT || 4000),path:req.url,method:req.method,headers:req.headers}, response => {res.writeHead(response.statusCode,response.headers);response.pipe(res);});
 upstream.on('error',()=>{res.writeHead(502);res.end('Start the library with npm run dev first.');});req.pipe(upstream);
}).listen(port,'127.0.0.1',()=>console.log('Compatibility server on http://127.0.0.1:'+port));
