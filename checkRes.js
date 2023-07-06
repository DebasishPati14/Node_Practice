const http = require('http');

const server = http.createServer((req, res) => {
    console.log("server Started");
    res.write("<html>");
    res.write("<head><title>My title</title></head>");
    res.write("<body>");
    res.write("<h2>Welcome To FIrst Node JS PAge</h2>");
    res.write("</body>");
    res.write("</html>");
    res.end();
    console.log("server got shut down")
})

server.listen(4200);