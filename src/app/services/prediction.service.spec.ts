import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { createModel } from '../data/model';
import { IProduct } from './models/products.model';
import { PredictionService } from './prediction.service';
import { ProductsService } from './products.service';
import { ResolverService } from './resolver.service';

describe('PredictionService', () => {
  let service: PredictionService;

  let productsService: IMock<ProductsService>;
  let httpClient: IMock<HttpClient>;
  let resolverService: IMock<ResolverService>;

  const products: IProduct[] = require('../../../server/assets/products.json');

  beforeEach(() => {
    productsService = Mock.ofType(ProductsService, MockBehavior.Strict);
    httpClient = Mock.ofType(HttpClient, MockBehavior.Strict);
    resolverService = Mock.ofType(ResolverService, MockBehavior.Strict);

    service = new PredictionService(
      productsService.object,
      httpClient.object,
      resolverService.object,
    );
  });

  it('test1', done => {
    productsService
      .setup(x => x.getProductRaw())
      .returns(() => {
        return of(products);
      });

    resolverService
      .setup(x => x.getModel())
      .returns(() => {
        return new Promise(resolve => {
          resolve(createModel(products.length));
        });
      })
      .verifiable(Times.once());

    service
      .guess(3, 'chain', 'road-front-derailleur')
      .pipe(take(1))
      .subscribe(
        x => {
          expect(x).toBeDefined();
          done();
        },
        err => {
          console.error(err);
          fail(err);
        },
      );
  });
});
