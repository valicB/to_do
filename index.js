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
    var tasks = fs.readdirSync('./database/');
    // console.log(tasks);
    if(action == "create" && entity == "task"){
        if(id !== undefined){
          if(!fs.existsSync('./database/' + id + '.json')){
            fs.writeFileSync('./database/' + id + '.json', JSON.stringify({ id: id }));
            res.write('File ' + id + '.json was created');
          } else res.write('File ' + id + '.json exists' + fs.readFileSync('./database/' + id + '.json'));
        } else res.write('The filename is not set. Please set the filename');
    } else if(action == "show" && entity == "task"){
        if(id !== undefined){
            if(fs.existsSync('./database/' + id + '.json')) res.write(fs.readFileSync('./database/' + id + '.json'));
            else res.write('404. File not found');
        } else{
            if(fs.existsSync('./database/' + id + '.json')){
              tasks.forEach(function(item) {
                fs.readFileSync('./database/' + item);
                res.write(fs.readFileSync('./database/' + item));
              });
            } else res.write('No more files found');
        }
    } else if (action == "delete" && entity == "task") {
        if (id !== undefined){
          if(fs.existsSync('./database/' + id + '.json')){
            fs.unlinkSync('./database/' + id + '.json');
            res.write('File ' + id + '.json was deleted');
          }
          else res.write('File ' + id + '.json dont exist');
        } else {
            if(tasks[0]){
              tasks.forEach(function(item) { fs.unlinkSync('./database/' + item) });
              res.write('Files was deleted');
            } else res.write('No more files found');
        }
    } else {
        res.write('404. Page not found');
    }
    /////////////////////////////////////

    res.end();
});
server.listen(config.options.port);
console.log("SERVER RUNNING PORT: " + config.options.port);
