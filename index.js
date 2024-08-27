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
                    categoria: val.categoria                
                }
            });

            let postSop = await Posts.find({}).sort({'views': -1}).limit(3).exec(); 

            postSop = postSop.map(function(val){
                return {
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    descricaoCurta: val.conteudo.substr(0,100),
                    imagem: val.imagem,
                    slug: val.slug,
                    categoria: val.categoria,
                    views: val.views
                }
            });

            res.render('home', { posts: posts, postSop: postSop });
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao buscar posts");
            res.redirect('/');
        }
    } else {

        try{
            let posts = await Posts.find({titulo : {$regex: req.query.busca, $options: "i"}});

            posts = posts.map(function(val){
                return {
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    descricaoCurta: val.conteudo.substr(0,100),
                    imagem: val.imagem,
                    slug: val.slug,
                    categoria: val.categoria,
                    views: val.views
                }
            });
            
            res.render('busca',{posts: posts,contagem: posts.length});

            
        }catch (err){
            console.error(err);
            res.status(500).send("Erro ao buscar notícias");
        } 
    }
});


app.get('/:slug', async (req, res) => {
    try {
        const resposta = await Posts.findOneAndUpdate(
            { slug: req.params.slug }, 
            { $inc: { views: 1 } }, 
            { new: true },
        );

        if (!resposta) {
            return res.status(404).send("Notícia não encontrada");
        }

        res.render('single', { noticia: resposta });
    }catch (err){
        console.error(err);
        res.status(500).send("Erro ao buscar a notícia");
    }
});

app.listen(5000, () => {
    console.log('Server rodando');
});
