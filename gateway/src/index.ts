import express, { Request, Response, NextFunction } from 'express';
import proxy from 'express-http-proxy'

const app = express();

app.use(express.json())

app.use('/customer', proxy('http://localhost:8001'))
app.use('/order', proxy('http://localhost:8003'))
app.use('/', proxy('http://localhost:8002'))

app.listen(8000, () => {
    console.log('Gateway is listening to port 8000');
})