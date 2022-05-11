const express = require('express');
const app = express();
const cors = require('cors');
const user = require('./routes/user');
const { default: mongoose } = require('mongoose');
const dbconfig = require('./config/dbconfig');
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
app.use(cors());
app.use(express.static("public"));
app.use("/upload",express.static("upload"));
global.__baseDir="http://localhost:5000";
mongoose.connect(dbconfig.url,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
}).then(console.log("mongoDb connected successfuly"));
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
app.listen(5000,() => console.log("the server listening on port 5000"));