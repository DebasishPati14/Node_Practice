const http = require('http');
const fs = require('fs');

const server = http.createServer((request, response) => {
  if (request.url === '/') {
    response.setHeader('content-type', 'text/html');
    response.write('<html>');
    response.write('<head><title>My title</title></head>');
    response.write("<body><form action='/message' method='POST' >");
    response.write('<h2>Enter Something</h2>');
    response.write(
      "<input type='text' name='message'><button type='submit'>send</button>"
    );
    response.write('</body>');
    response.write('</html>');
    return response.end();
  }
  if (request.url === '/message' && request.method === 'POST') {
    const body = [];
    request.on('data', (chunk) => {
      body.push(chunk);
      console.log(chunk);
    });

    request.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      fs.writeFileSync('message.txt', parsedBody.split('=')[1]);
      console.log(parsedBody);
    });

    response.statusCode = 302;
    response.setHeader('Location', '/');
    return response.end();
  }
  response.write('<html>');
  response.write('<head><title>My title</title></head>');
  response.write('<body>');
  response.write('<h2>Welcome To Message JS PAge</h2>');
  response.write('</body>');
  response.write('</html>');
  response.end();
});

server.listen(3000);
