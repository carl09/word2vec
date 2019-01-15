import { ICartSave } from './src/app/services/models/index';
import * as express from 'express';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';
const app = express();
const port = 3000;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// app.use(function(req, res) {
//   res.setHeader('Content-Type', 'text/plain');
//   res.write('you posted:\n');
//   res.end(JSON.stringify(req.body, null, 2));
// });

app.get('/products', (req, res) => {
  const contents = fs.readFileSync('./src/assets/products.json').toString();
  res.send(JSON.parse(contents));
});

app.get('/cartData', (req, res) => {
  const contents = fs.readFileSync('./src/assets/cartData.json').toString();
  res.send(JSON.parse(contents));
});

app.post('/cartData', (req, res) => {
  const body: ICartSave = req.body;
  console.log(req.body);

  const contents = fs.readFileSync('./src/assets/cartData.json').toString();
  const existing: ICartSave[] = JSON.parse(contents);

  existing.push(body);

  fs.writeFileSync('./src/assets/cartData.json', JSON.stringify(existing));

  res.send(existing);
  //   const contents = fs.readFileSync('./src/assets/cartData.json').toString();
  //   res.send(JSON.parse(contents));
});

app.use('/assets', express.static('./src/assets/'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
