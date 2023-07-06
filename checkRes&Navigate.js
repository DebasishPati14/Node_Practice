const http = require('http');
const routeExport = require('./routeExport');

const server = http.createServer(routeExport);

// const server = http.createServer((req, res) => {
//     if (req.url === '/') {
//         res.write("<html>");
//         res.write("<head><title>My title</title></head>");
//         res.write("<body>");
//         res.write("<form action='/message'><input type='text' name='username' placeholder='User Name'/><button type='submit'>FillUp</button></form>");
//         res.write("</body>");
//         res.write("</html>");
//         res.end();
//     }
//     res.write("<html>");
//     res.write("<head><title>My title</title></head>");
//     res.write("<body>");
//     res.write("<h2>Welcome To First Node JS Page</h2>");
//     res.write("</body>");
//     res.write("</html>");
//     res.end();
// })
server.listen('3000');