const express=require('express');
const hireApp=express();

const cors=require('cors');

hireApp.use(cors({
    origin:'https://hire-mate.vercel.app'
}))

hireApp.use(express.json());
const Dotenv=require('dotenv');
Dotenv.config();

const {MongoClient} =require('mongodb');
let mClient = new MongoClient(process.env.DB_URL);

mClient.connect().then((connectObj)=>{
    const hireMatedb= connectObj.db('HireMate');
    hireApp.listen(8000, () => console.log('HTTP server started on PORT 8000'));
    const usersCollection = hireMatedb.collection('users');
    const hirersCollection = hireMatedb.collection('hirers');
    const allMessagesCollection = hireMatedb.collection('allMessages');
    const jobDoneList=hireMatedb.collection('completedJobList');
    const walletAndRatingCollection = hireMatedb.collection('ratingAndWallet');
    console.log('DB connection is Successful');
    hireApp.set('usersCollection',usersCollection);
    hireApp.set('hirersCollection',hirersCollection);
    hireApp.set('allMessagesCollection',allMessagesCollection);
    hireApp.set('jobDoneList',jobDoneList);
    hireApp.set('walletAndRatingCollection',walletAndRatingCollection);
})
.catch(err=> console.log("Error in DB connection: ",err));

const userapp = require('./APIs/userApi');
hireApp.use('/user-api', userapp);
const uploadRoute = require('./APIs/upload');
hireApp.use('/image-api',uploadRoute);

hireApp.use('*',(req,res,next)=>{
    console.log(req.path)
    res.send({message:`Invalid path`})
})
