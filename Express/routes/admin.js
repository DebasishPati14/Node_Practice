const express = require('express');
const router = express.Router();
const path = require('path')


router.post('/products', (req, res, next) => {
    console.log(req.body);
    res.redirect('/message');
})

router.get('/add-product', (req, res, next) => {
    // res.send(`<form action='/products' method='POST'>
    //              <input type='text' name='productName'/>
    //              <button type='submit'>Add</button>
    //           </form>`);
    res.sendFile(path.join(__dirname, '../', 'views', 'admin.html'))
})

module.exports = router;