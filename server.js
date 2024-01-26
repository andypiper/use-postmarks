import express from 'express';
import { create } from 'express-handlebars';

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.disable('x-powered-by');

const hbs = create({
  partialsDir: './views/partials',
  extname: '.hbs',
});

app.set('view engine', '.hbs');
app.set('views', './views');
app.engine('.hbs', hbs.engine);

// force HTTPS in production
if (process.env.ENVIRONMENT === 'production') {
  app.set('trust proxy', ['127.0.0.1', '10.0.0.0/8']);

  app.use(({ secure, hostname, url, port }, response, next) => {
    if (!secure) {
      return response.redirect(308, `https://${hostname}${url}${port ? `:${port}` : ''}`);
    }

    return next();
  });
} else {
  console.log("ENVIRONMENT is not 'production', HTTPS not forced");
}


app.get("/", (request, response) => {

// Here's some data that the our server knows:
  let dt = new Date();
  let data = {
    projectName: process.env.PROJECT_DOMAIN,
    luckyNumber: Math.floor(Math.random()*1000),
    serverTime: new Date(),
    ip: (request.headers["x-forwarded-for"]||"").split(",")[0],
    msg: "woot"
  };

  data.json = JSON.stringify(data, null, 2);
  
  response.render('home', data);
});


// And we end with some more generic node stuff -- listening for requests :-)
let listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
