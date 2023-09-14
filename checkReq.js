const http = require('http');

const server = http.createServer((res, req) => {
  console.log(res.method, res.url, res.headers);
});

server.listen(4200);
