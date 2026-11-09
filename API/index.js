const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PATCH, DELETE');
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(express.json());

const PORT = process.env.PORT || 3000;
const routes = require('./routes/routes');
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
});

// Obtendo os parametros passados pela linha de comando
var userArgs = process.argv.slice(2);
// Banco anterior mantido como backup:
// var mongoURL_antigo = "mongodb+srv://ProjetoSistemasIntegrados:SistemasIntegrados@cluster0.p3xhbzg.mongodb.net/tarefasDB?retryWrites=true&w=majority";
var mongoURL = userArgs[0] || "mongodb+srv://ezolima3000_db_user:RemnyItq50Omdp4Q@cluster0.0cl4e64.mongodb.net/tarefasDB?retryWrites=true&w=majority";

// Configurando a conexao com o Banco de Dados
var mongoose = require('mongoose');
mongoose.connect(mongoURL).catch(err => {
    console.log('Aviso: Aguardando conexao com MongoDB (' + err.message + ')');
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', (error) => {
    console.log('Erro no banco de dados:', error.message || error);
});
db.once('connected', () => {
    console.log('Database Connected');
});
