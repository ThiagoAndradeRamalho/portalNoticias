const express = require('express')
const http = require('http')

var tarefas = ['olhar','mover']

var app = express()

app.get('/',(req,res)=>{
    res.send('html',{tarefasList:tarefas})
})

app.listen(5000, function(){
    console.log("Server rodando")
})