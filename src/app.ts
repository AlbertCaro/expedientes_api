import express from 'express';
import connection from "./db/config";
import divisionRouter from "./routes/divisionHandler";
import {json, urlencoded} from 'body-parser';
import dotenv from 'dotenv';
import departamentoRouter from './routes/departamentoHandler';
import profesoresRouter from './routes/profesoresHandler';
import usuariosRouter from './routes/usuariosHandler';
import loginRouter from './routes/loginHandler';
import { verifyToken } from './middleware/verify_token';
import cors from 'cors';

const app = express();
dotenv.config();
const port = process.env.PORT;

app.use(json());
app.use(cors());
app.use(cors({
    origin: '*',
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}));
app.use(urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send('Hola diplomado en desarrollo web!!!');
});


app.use('/division',verifyToken,divisionRouter);
app.use('/departamento',verifyToken,departamentoRouter);
app.use('/profesores',verifyToken,profesoresRouter);
app.use('/usuarios',verifyToken,usuariosRouter);
app.use('/login',loginRouter);

connection.sync().then(()=>{
    console.log("La base de datos funciona");
}).catch((error)=>{
    console.log("error en la db ",error);
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

