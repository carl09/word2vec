import * as bodyParser from 'body-parser';
import * as express from 'express';
import { createModel } from '../src/app/data/model';
import { ICartSave } from '../src/app/services/models/index';
import { getCartSavedData, getProductByCode, getProducts, setCartSavedData } from './data';
import { generateModel } from './generate-model';
import { guessProduct } from './service';

const app = express();
const port = 3000;

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/product', async (_req, res) => {
  res.json(await getProducts());
});

app.get('/product/:code', async (req, res) => {
  res.json(await getProductByCode(req.params.code));
});

app.get('/product/:code/suggest', async (req, res) => {
  res.json(await guessProduct(req.params.code));
});

app.get('/cartData', async (_req, res) => {
  res.json(await getCartSavedData());
});

app.post('/cartData', async (req, res) => {
  const body: ICartSave = req.body;
  console.log(req.body);

  const existing = await getCartSavedData();

  existing.push(body);

  await setCartSavedData(existing);
  const products = await getProducts();

  await generateModel(products, existing, createModel(products.length), 100).then(() => {});

  res.json(existing);
});

app.use('/assets', express.static('./server/assets/'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
