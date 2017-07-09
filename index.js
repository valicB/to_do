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
        if(id !== undefined && id.length > 0){
          if(id.split('?')[1] !== undefined){
            var title = id.split('?')[1].split('&')[0].split('=')[1];
            var description = id.split('?')[1].split('&')[1].split('=')[1];
            var deadline = id.split('?')[1].split('&')[2].split('=')[1];
            // Metota 1 - gasim maximum prin adaugarea numerelor in array
            // var arr=[];
            // tasks.forEach(function(item){ arr.push(item.split('.')[0]); });
            // task_id = Math.max(...arr) + 1;
            // Metoda 2 - gasim maximum prin comparatie
            var task_id = 0;
            tasks.forEach(function(item){
              if(task_id < Number(item.split('.')[0])) task_id = Number(item.split('.')[0]);
            });
            task_id = task_id + 1;
            // if(!fs.existsSync('./database/' + task_id + '.json')){ - nu mai este nevoie de verificare pentru ca de fiecare data se verifica toate fisierele din database si se creaza unul nou cu o cifra mai mare
              fs.writeFileSync('./database/' + task_id + '.json', JSON.stringify({
                                                                                  id          : task_id,
                                                                                  title       : title,
                                                                                  description : description,
                                                                                  deadline    : deadline
                                                                                }));
              res.write('File ' + task_id + '.json was created');
          } else res.write('Error - Please check URL.');
        } else  res.write(fs.readFileSync('./public/create.html'));

    } else if(action == "show" && entity == "task"){
        if(id !== undefined && id.length > 0){
            if(fs.existsSync('./database/' + id + '.json')) res.write(fs.readFileSync('./database/' + id + '.json'));
            else res.write('404. File not found');
        } else tasks.forEach(function(item) { res.write(fs.readFileSync('./database/' + item)) });

    } else if (action == "delete" && entity == "task") {
        if (id !== undefined && id.length > 0){
          if(fs.existsSync('./database/' + id + '.json')){
            fs.unlinkSync('./database/' + id + '.json');
            res.write('File ' + id + '.json was deleted');
          }
          else res.write('File ' + id + '.json dont exist');
        } else {
            if(tasks[0]){
              tasks.forEach(function(item) { fs.unlinkSync('./database/' + item) });
              res.write('All files were deleted');
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
