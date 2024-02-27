const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss=require('xss-clean');
const hpp=require('hpp');
const cors = require('cors');

//Load env vars
dotenv.config({path:'./config/config.env'});

//Connect to database
connectDB();

//Body parser
const app=express();
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
//Enable CORS
app.use(cors(corsOptions));


//route files
const transaction = require ('./routes/transactions');
const auth = require('./routes/auth');

//Prevent http param pollutions
app.use(hpp());

app.use('/api/v1/transactions',transaction);
app.use('/api/v1/auth',auth);


// app.get('/', (req,res) => {
//     // res.send("<h1>Hello from express</h1>");
//     // res.send({name:"Brad"});
//     // res.json({name:"Brad"});
//     // res.sendStatus(400);
//     // res.status(400).json({success:false});
//      res.status(200).json({success:true, data:{id:1}});
// });



const PORT=process.env.PORT || 4000;

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(()=>process.exit(1))

});
