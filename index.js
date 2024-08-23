const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const path = require('path');
const app = express();

mogoose.connect('',{useNewUrlParser: true, uneUnifiedTopology: true}).then(function(){
    console.log("Conectado com sucesso")
}).catch(function(err){
    console.log(err.message)
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.engine('html',require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));

app.get('/',(req,res)=>{

    console.log(req.query);

    if(req.query.busca == null){
        res.render('home',{})
    }else{
        res.render('busca',{})
    }
    
})

app.get('/:slug',(req,res)=>{
    //res.send(req.params.slug)
    res.render('single',{})
})

app.listen(5000,()=>{
    console.log('Server rodando');
})