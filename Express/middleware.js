const exp = require('express')
const app = exp()

app.use('/', (req, res, next) => {
  console.log('in first middleware(runs always)')
  next()
})

app.use('/add', (req, res, next) => {
  console.log('In second middleware')
  res.send('<h1>This is add page</h1>')
})

app.use('/', (req, res, next) => {
  console.log('In last middleware')
  res.send('<h1>This is default page</h1>')
})

// const server = http.createServer(app);
// server.listen(9000);

app.listen(9000)
