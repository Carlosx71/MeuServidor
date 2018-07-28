/*Restify framework
----------------------------------------------------------------------------*/
const restify = require('restify');
const errs = require('restify-errors');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

/*Amarrando o banco
----------------------------------------------------------------------------*/
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'chobits',
    database: 'db'
  }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});

// Rotas REST

server.get('/', restify.plugins.serveStatic({
  directory: './dist',
  file: 'index.html'

}));


server.get('/read', function (req, res, next) {

  knex('rest').then((dados) => {

    res.send(dados);
  }, next);

  return next();
});

server.post('/create', function (req, res, next) {

  knex('rest')

    .insert(req.body)

    .then((dados) => {

      res.send(dados);


    }, next);

  return next();
});

server.get('/show/:id', function (req, res, next) {

  const { id } = req.params;

  knex('rest')

    .where('id', id)

    .first()

    .then((dados) => {

      if (!dados) return res.send(new errs.BadRequestError('Dados nao encontrados'))

      res.send(dados);


    }, next);
});

server.put('/update/:id', function (req, res, next) {

  const { id } = req.params;

  knex('rest')

    .where('id', id)

    .update(req.body)

    .then((dados) => {

      if (!dados) return res.send(new errs.BadRequestError('Dados nao encontrados'))

      res.send('Dados atualizados com sucesso');


    }, next);
});

server.del('/delete/:id', function (req, res, next) {

  const { id } = req.params;

  knex('rest')

    .where('id', id)

    .delete()

    .then((dados) => {

      if (!dados) return res.send(new errs.BadRequestError('Dados nao encontrados'))

      res.send('Dados excluidos');


    }, next);
});