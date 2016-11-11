var http=require("http");
var fs = require("fs");
var mime=require("mime");
var server=http.createServer(handle);
//绑定服务器
var io = require("socket.io")(server);
function handle(req,res){
    var filePath="";
    if (req.url=="/"){
       filePath="./html/index.html";
    }else{
       filePath="./"+req.url;
    }
    serverStatic(res,filePath);
}

function serverStatic(res,filePath) {
    fs.exists(filePath,function (exists) {
        if (exists){
            fs.readFile(filePath,function (err,data) {
               if (err){
                   send404(res);
               }
               res.writeHead(200,{
                   "Content-Type":mime.lookup(filePath)
               })
                res.end(data);
            })

        }else{
            send404(res);
        }

    })
}
var num=1;
io.on('connection', function (socket) {
    var username="h9";
    num++;
    socket.on('text', function (data) {
        var text=data.info;
        console.log(text);
        socket.broadcast.emit('news',{name:username,num:num,text:text});
    })

})

function send404(res){
    res.writeHead(404,{
        "Content-Type":"text/plain"
    })
}

server.listen(3000,function () {
    console.log("服务器已打开 http://127.0.0.1:3000");
})