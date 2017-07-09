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
          var task_id = id.split('?')[0];
          if(id.split('?')[1] !== undefined){
            var title = id.split('?')[1].split('&')[0].split('=')[1];
            var description = id.split('?')[1].split('&')[1].split('=')[1];
            var deadline = id.split('?')[1].split('&')[2].split('=')[1];
            //cream  un array pentru a pune in el denumirea fisierelor din database.
            var arr=[];
            tasks.forEach(function(item){ arr.push(item.split('.')[0]); }); // item.split('.')[0]) - luam doar prima parte din denumirea fisierului.functia push() adauga de fiecare data elementul la sfarsitul array-ului
            task_name = Math.max(...arr) + 1; // functia Math.max(...array) - returneaza maximum din array. adunam 1 pentru a obtine o noua denumire la fisierul json nou creat
            // if(!fs.existsSync('./database/' + task_name + '.json')){ - nu mai este nevoie de verificare pentru ca de fiecare data se verifica toate fisierele din database si se creaza unul nou cu o cifra mai mare
              fs.writeFileSync('./database/' + task_name + '.json', JSON.stringify({
                                                                                  id          : task_name,
                                                                                  title       : title,
                                                                                  description : description,
                                                                                  deadline    : deadline
                                                                                }));
              res.write('File ' + task_name + '.json was created');
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
