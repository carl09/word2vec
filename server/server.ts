import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as fs from 'fs';
import { createModel } from '../src/app/data/model';
import { ICartSave, IProduct } from '../src/app/services/models/index';
import { generateModel } from './generate-model';

const app = express();
const port = 3000;

let UpdatingModel = false;

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/products', (_req, res) => {
  const contents = fs.readFileSync('./server/assets/products.json').toString();
  res.send(JSON.parse(contents));
});

app.get('/cartData', (_req, res) => {
  const contents = fs.readFileSync('./server/assets/cartData.json').toString();
  res.send(JSON.parse(contents));
});

app.post('/cartData', (req, res) => {
  const body: ICartSave = req.body;
  console.log(req.body);

  const contents = fs.readFileSync('./server/assets/cartData.json').toString();
  const existing: ICartSave[] = JSON.parse(contents);

  existing.push(body);

  fs.writeFileSync('./server/assets/cartData.json', JSON.stringify(existing));

  if (!UpdatingModel) {
    UpdatingModel = true;
    const productsJson = fs.readFileSync('./server/assets/products.json').toString();

    const products = JSON.parse(productsJson) as IProduct[];

    generateModel(products, existing, createModel(products.length), 100).then(() => {
      UpdatingModel = false;
    });
  }

  res.send(existing);
});

app.use('/assets', express.static('./server/assets/'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
