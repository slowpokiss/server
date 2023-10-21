const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const { v4: uuidv4 } = require('uuid');
const app = new Koa();

let cards = [];

app.use(koaBody({
  urlencoded: true,
  multipart: true
}));

// GET ?method=loadPage
app.use((ctx, next) => {
  if (ctx.method !== "GET" || ctx.request.query.method !== 'loadPage') {
    next();
    return;
  }

  ctx.response.set('Access-Control-Allow-Origin', '*');
  cards = [];
  ctx.response.body = 'page updated';
  next();
})



// POST ?method=createTicket
app.use(async (ctx, next) => {
  if (ctx.method !== 'POST' || ctx.request.query.method !== 'createTicket') {
    next();
    return;
  }
  
  const date = new Date();
  const { name, description } = ctx.request.body;
  const Ticket = {
    id: uuidv4(),
    name,
    status: false,
    description,
    created: `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}`
  }

  cards.push(Ticket);
  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.body = JSON.stringify(Ticket);
  next();
});

// GET ?method=deleteById&id=<id>
app.use(async (ctx, next) => {
  if (ctx.method !== 'GET' || ctx.request.query.method !== 'deleteById') {
    await next();
    return;
  }
  const { id } = ctx.request.query;

  cards = cards.filter(ticket => ticket.id !== id);
  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.body = 'Ticket deleted';
  next()
});

// GET ?method=allTickets
app.use(async (ctx, next) => {
  if (ctx.method !== 'GET' || ctx.request.query.method !== 'allTickets') {
    await next();
    return;
  }

  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.type = 'application/json';
  ctx.response.body = JSON.stringify(cards);
  next()
});


// GET ?method=ticketById
app.use(async (ctx, next) => {
  if (ctx.method !== 'GET' || ctx.request.query.method !== 'ticketById') {
    await next();
    return;
  }

  const { id } = ctx.request.query;
  let ticket = cards.find(el => el.id === id);

  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.type = 'application/json';
  ctx.response.body = JSON.stringify(ticket);
  next()
});


const server = http.createServer(app.callback());
const port = 7077;
server.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Server is running on port ' + port);
});
