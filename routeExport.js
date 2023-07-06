const fs = require('fs');

const requestHandler = (req, res) => {
    const method = req.method;
    if (req.url === '/') {
        res.write("<html>");
        res.write("<head><title>My title</title></head>");
        res.write("<body>");
        res.write("<form action='/message' method='POST'><input type='text' name='username' placeholder='User Name'/><button type='submit'>FillUp</button></form>");
        res.write("</body>");
        res.write("</html>");
        return res.end();
    }
    if (method == 'POST' && req.url === '/message') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            const buffer = Buffer.concat(body).toString();
            console.log(buffer);
            const data = buffer.split('=')[1];
            console.log(data)
            fs.writeFileSync('newDoc.txt', data);
        })

        res.statusCode = 302;
        res.setHeader('header', '/');
        return res.end()
    }
    res.write("<html>");
    res.write("<head><title>My title</title></head>");
    res.write("<body>");
    res.write("<h2>Welcome To First Node JS Page</h2>");
    res.write("</body>");
    res.write("</html>");
    res.end();
}

module.exports = requestHandler;