import express, { json, urlencoded } from 'express';
import cors from 'cors';
import user from './routes/user.js';
import { default as mongoose } from 'mongoose';
import dbConfig from './config/dbconfig.js';
const app = express();
app.use(json());
app.use(urlencoded({
    extended:true
}));
app.use(cors());
app.use(express.static("public"));
// app.use("/upload",static("upload"));
global.__baseDir="https://visiting-card-backend.herokuapp.com";
app.get("/",(req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID,Content-Type,Accept,X-Custom-Header,Authorization,");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    if(req.method === "OPTIONS"){
        return res.status(200).end();
    }
    next();
    
});
app.use('/user',user);
mongoose.connect(dbConfig.localUrl,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
}).then( () =>{
    app.listen(4000,() => console.log("the server listening on port 5000")).on("error", function (err) {
        process.once("SIGUSR2", function () {
          process.kill(process.pid, "SIGUSR2");
        });
        process.on("SIGINT", function () {
          // this is only called on ctrl+c, not restart
          process.kill(process.pid, "SIGINT");
        });
      });
    console.log("mongoDb connected successfuly")
}).catch((error)=> console.log(error))