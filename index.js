// CRUD - Create Read Update Delete
var config = require('./config.js');
var http = require('http');
var fs   = require('fs');
// create server
var server = http.createServer((req,res)=>{

    ////////////ROUTING///////////////////
    // action/entity/id
    var url = req.url;
    [x,action,entity,id] = url.split("/");
    // console.log(id);
    if(action == "create" && entity == "task"){
        if(id !== undefined){
            fs.writeFileSync('./database/' + id + '.json', JSON.stringify({ id: id }));

        }
    } else if(action == "show" && entity == "task"){
        if(id !== undefined){
            if (fs.existsSync('./database/' + id + '.json')) {
                var task = fs.readFileSync('./database/' + id + '.json');
                res.write(task);
            }
        }
    } else {
        var tasks = fs.readdirSync('./database');
        for(var i=0; i<tasks.length; i++){
            var task = fs.readFileSync('./database/' + tasks[i]);
            res.write(task);
        }
        // console.log(tasks);
    }
    /////////////////////////////////////

    res.end("All good!");
});
server.listen(config.options.port);
console.log("SERVER RUNNING PORT: " + config.options.port);
