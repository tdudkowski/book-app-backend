const http = require('http');
const url = require('url');
const { ObjectId } = require('mongodb');

const hostname = '127.0.0.1';
const port = 3001;
const { db } = require("./db_connection");

const availableEndpoints = [
    {
      method: "GET",
      getUsers: "/api"
    },
    {
      method: "POST",
      addOneFunction: "/api"
    },
    {
      method: "PUT",
      updateOneFunction: "/api"
    }
    ,
    {
      method: "DELETE",
      deleteOneFunction: "/api"
    }
  ]

const invalidUrl = function(req, res) {
    let response = [
      {
        "message": "oops! that is a wrong endpoint, here are the available endpoints "
      },
      availableEndpoints
    ]
 res.statusCode = 404;
    res.setHeader('content-Type', 'Application/json');
    res.end(JSON.stringify(response))
 }

 // API PUT
 const updateOneFunction = async (req, res, collection) => {
  body = '';
  req.on('data',  function (chunk) { body += chunk; });
  req.on('end', async function () {
    postBody = JSON.parse(body);
    let o_id = new ObjectId(postBody._id);
    delete postBody["_id"];
    const result = await collection.findOneAndReplace({"_id":o_id}, postBody);
   res.writeHead(200, {'content-Type': 'Application/json',
  'Access-Control-Allow-Origin': 'http://localhost:3000'});
  res.end(JSON.stringify(result))
  })
}

// API POST
const addOneFunction = async (req, res, collection) => {
  body = '';
  req.on('data', async function (chunk) { body += chunk; });
  req.on('end', async function () {
    postBody = JSON.parse(body);

  typeof postBody === "string" ? postBody = JSON.parse(postBody) : null;
   
  try {
    collection.insertOne(postBody);
  } catch (err) {
    console.log(err);
  };

  res.writeHead(200, {'content-Type': 'Application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000'});
  res.end(JSON.stringify(postBody))
  })
}

// API DELETE
const deleteOneFunction = async (req, res, collection) => {
  body = '';
    
  req.on('data',  function (chunk) {
    body += chunk;
  });

  req.on('end', async function () {
    postBody = JSON.parse(body);
    let response = [ postBody ];
    const result = await collection.deleteOne({_id: new ObjectId(postBody)})
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }

  res.writeHead(200, {'content-Type': 'Application/json',
  'Access-Control-Allow-Origin': 'http://localhost:3000'});
  res.end(JSON.stringify(response))
  })
}

// SERVER
const server = http.createServer( async (req, res) => { 

    const result = await db.collection("Books01").find().toArray();
    const reqUrl =  url.parse(req.url, true);
    const collection = db.collection("Books01");
    
// / GET
if (reqUrl.pathname === '/' && req.method === 'GET') {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000' });
  res.write(`Hello World, that's the list! Number of the books: ${result.length}`);
  for (let i =0; i < result.length; i++) {
      res.write(`${result[i]['author']} - ${result[i]['title']}\n`)
        }        
  res.end(JSON.stringify(result));
}

// API PUT
else if (reqUrl.pathname === '/api' && req.method === 'PUT') {
  res.writeHead(201, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000' });
  updateOneFunction(req, res, collection);
  res.end("This is API PUT");
}

// API POST
else if (reqUrl.pathname === '/api' && req.method === 'POST') {
     console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
    addOneFunction(req, res, collection);
 }

// API DELETE
else if (req.url === '/api' && req.method === 'DELETE') {
  res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:3000' });
  deleteOneFunction(req, res, collection);
  res.end("This is API DELETE");
}

// API GET
else if (reqUrl.pathname === '/api') {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'PUT, DELETE',
    'Access-Control-Allow-Origin': 'http://localhost:3000' });
  res.end(JSON.stringify(result));
}

// invalid URL
else {
    console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
    invalidUrl(req, res);
    // res.end("this resource does not exist");
  }

}
)

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});