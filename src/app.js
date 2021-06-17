const express = require('express');
const hbs = require('hbs');
var requests = require('requests');
const path = require('path');
const { title } = require('process');
const http = require('http');
const url = require('url');


const port=process.env.PORT||8000; 

const app=express();

app.set('view engine','hbs');
app.set('views',path.join(__dirname,'../views'))
app.use(express.static(path.join(__dirname,'../public')))

app.get('/todos',(req, res) =>{
    requests(`https://jsonplaceholder.typicode.com/todos`)
    .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const result =  []
        for(var i=0;i<objdata.length;i++){
            result.push({
                id:objdata[i].id,
                title:objdata[i].title,
                completed:objdata[i].completed
            })
        }
        res.send(result);
    }).on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
    });
})

app.get(`/user/:id`,(req,res)=>{
    requests(`https://jsonplaceholder.typicode.com/users/${req.params.id}`)
    .on("data", (chunk) => {
        const userdata = JSON.parse(chunk);
        console.log(userdata)
        requests(`https://jsonplaceholder.typicode.com/todos`).on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const result =  []
            for(var i=0;i<objdata.length;i++){
                if(objdata[i].userId==req.params.id){
                    result.push({
                        id:objdata[i].id,
                        title:objdata[i].title,
                        userId:objdata[i].userId,
                        completed:objdata[i].completed
                    })
                }
            }
            res.send({
                id:userdata.id,
                name:userdata.name,
                email:userdata.email,
                phone:userdata.phone,
                todos:result
            })
        }).on("end", (err) => {
            if (err) return console.log("connection closed due to errors", err);
        });
    }).on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
    });
    
})



app.listen(port,()=>{
    console.log(`listening at port ${port}`);
})