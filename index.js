const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const Posts = require('./Posts');

mongoose.connect('mongodb+srv://root:ZUGEnnzA9Lby9em5@cluster0.ogzvt.mongodb.net/portalNoticias?retryWrites=true&w=majority&appName=Cluster0', {
}).then(function() {
    console.log("Conectado com sucesso");
}).catch(function(err) {
    console.log(err.message);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));

app.get('/', async (req, res) => {
    console.log(req.query);

    if (req.query.busca == null) {
        try {
            let posts = await Posts.find({}).sort({'_id': -1}).exec(); 

            posts = posts.map(function(val){
                return {
                titulo: val.titulo,
                conteudo: val.conteudo,
                descricaoCurta: val.conteudo.substr(0,100),
                imagem: val.imagem,
                slug: val.slug,
                categoria: val.categoria,
                
                }
            })
            
            res.render('home', { posts: posts });
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao buscar posts");
        }
    } else {
        res.render('busca', {});
    }
});

app.get('/:slug', (req, res) => {
    res.render('single', {});
});

app.listen(5000, () => {
    console.log('Server rodando');
});
