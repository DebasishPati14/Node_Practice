const exp = require('express');
const adminRouter = require('./router/admin');
const path = require('path');
const routingPath = require('./utils/paths')
const userRouter = require('./router/user');

const app = exp();

app.use(exp.static(path.join(__dirname, 'public')))

app.use('/admin', adminRouter);
app.use('/user', userRouter);

// app.use((req, res, next) => {
//     res.status(404).send('<h1>Error Page Page Not Found</h1>');
// });


app.use((req, res, next) => {
    res.status(404).sendFile(path.join(routingPath, 'views', 'noPage.html'));
});


app.listen(3000);