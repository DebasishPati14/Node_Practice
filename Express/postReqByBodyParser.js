const exp = require('express');
const bodyParser = require('body-parser');
// const adminRouter = require('./router/admin');
// const userRouter = require('./router/user')
const app = exp();

app.use(bodyParser.urlencoded());

app.get('/main', (req, res, next) => {
    res.send("<h2>Main Application Page</h2>");
});

app.get('/add-product', (req, res, next) => {
    res.send(`<form action='/products' method='POST'>
    <input type='text' name='productName'/>
    <button type='submit'>Add</button>
    </form>`)
});

app.post('/products', (req, res, next) => {
    console.log('hello', req.body);
    res.redirect('/');
});


app.get('/', (req, res, next) => {
    res.send('<h1>Redirected Page</h1>');
});

app.get('*', (req, res, next) => {
    res.send('<h3>Error 404</h3>')
})

// app.get(adminRouter);
// app.use(userRouter);


app.listen(3000);