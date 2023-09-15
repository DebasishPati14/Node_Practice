/* eslint-disable n/handle-callback-err */
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const method = req.method;
  if (req.url === '/') {
    res.write('<html>');
    res.write('<head><title>My title</title></head>');
    res.write('<body>');
    res.write(
      "<form action='/message' method='POST'><input type='text' name='username' placeholder='User Name'/><button type='submit'>FillUp</button></form>"
    );
    res.write('</body>');
    res.write('</html>');
    return res.end();
  }
  if (req.url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    req.on('end', () => {
      const buffer = body.concat(body).toString();
      console.log(typeof buffer);
      const data = buffer.split('=')[2];
      fs.writeFileSync('newDoc.txt', data, (err) => {
        res.statusCode = 302;
        res.setHeader('Customised Header', '/');
        return res.end();
      });
    });
    return res.end();
  }
  res.write('<html>');
  res.write('<head><title>My title</title></head>');
  res.write('<body>');
  res.write('<h2>Welcome To First Node JS Page</h2>');
  res.write('</body>');
  res.write('</html>');
  res.end();
});

server.listen(4200);
