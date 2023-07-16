const fs= require('fs');//these are module
const http=require('http');
const url=require('url');
const querystring = require('querystring');
/////////////////////////////////////////////////////////////
//Blockin Synchronous way
// const textIn=fs.readFileSync('./txt/input.txt' , 'utf-8');
// console.log(textIn);

// const textOutput=`This is what we know about the avacado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/input.txt',textOutput);
// console.log('File Written')

//non blocking unsynchronous way
// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8',(err,data3)=>{
//             console.log(data3);

//             fs.writeFile('./txt/final.txt',`${data3}`,'utf-8',err=>{
//             console.log('file has been written :)')
//             })
//             });
//         });
// });
// console.log('will read file');
////////////////////////////////////////////////////////////////
//SERVER
const replaceTemplate=(temp,product)=>{
    let output=temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output=output.replace(/{%IMAGE%}/g,product.image);
    output=output.replace(/{%PRICE%}/g,product.price);
    output=output.replace(/{%FROM%}/g,product.from);
    output=output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output=output.replace(/{%QUANTITY%}/g,product.quantity);
    output=output.replace(/{%DESCRIPTION%}/g,product.description);
    output=output.replace(/{%ID%}/g,product.id);
    if(!product.organic) output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    return output;
}
const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataobj=JSON.parse(data);
const tempOverview=fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/templates/card.html`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8');

const server=http.createServer((req,res)=>{//server callback
    const baseURL = `http://${req.headers.host}`;
    const requestURL = new URL(req.url, baseURL);
    // Get's the relative path requested from the URL. In this case it's /product. 
    const pathName = requestURL.pathname;
    // Get's the query data from the URL. This is ?id=0 We store this in queryURL
    const queryURL = requestURL.search;
    // Remove the ? from the ?id=0 before we make it into an object.
    const parseString = queryURL.substring(1);
    // Parse the query into an object. Our object will be the query variable.
    const query = querystring.parse(parseString);
 
 if(pathName=='/' || pathName=='/overview')
 {
    const cardsHtml=dataobj.map(el=>replaceTemplate(tempCard,el)).join('');
    const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
    res.writeHead(200,{'Content-type':'text/html'});
    res.end(output);
 } 
 //product
 else if(pathName=='/product')
 {
    res.writeHead(200,{'Content-type':'text/html'});
    const product=dataobj[query.id];
    const output=replaceTemplate(tempProduct,product);
    res.end(output);
 }//api
 else if(pathName=='/api')
 {
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(data);
 }
 else
 {
res.end('Page not found');
 }
    
});

server.listen(8000,`127.0.0.1`,()=>{
    console.log('sun rha hu m listeing on port 8000')
});
