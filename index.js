const http = require('http');
const url = require('url');
const fs = require('fs');
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-Card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

//Server
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8")
const dataObj = JSON.parse(data)

const server = http.createServer((req, res)=> {
    
    const {query, pathname} = url.parse(req.url, true)

    // OVERVIEW PAGE
    if(pathname == "/" || pathname == "/overview"){
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        const cardsHtml = dataObj.map(i => replaceTemplate(tempCard, i)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)
        res.end(output)
    }

    // PRODUCT PAGE
    else if(pathname == "/products") {
        const product= dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
    }

    //API
    else if(pathname == "/api"){
           res.writeHead(200, {
            'Content-Type': 'application/json',
           })
           res.end(data)
    }

    //PAGE NOT FOUND
    else {
        res.writeHead(404,  {
            'content-type': 'text/html'
        });
        res.end("<h1>Page not found Err: 404</h1>")
    }
});

server.listen(8000, '127.0.0.1', ()=>{
    console.log("listing to port 8000")
});