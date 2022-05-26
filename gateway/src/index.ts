import express, { Request, Response, NextFunction } from 'express';
import proxy from 'express-http-proxy'

const app = express();

app.use(express.json())

app.use('/customer', proxy('http://localhost:7001'))
app.use('/order', proxy('http://localhost:7003'))
app.use('/', proxy('http://localhost:7002'))

app.listen(7000, () => {
    console.log('Gateway is listening to port 7000');
})