import { Injectable } from '@angular/core';
import { LayersModel, loadLayersModel } from '@tensorflow/tfjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResolverService {
  public productsList(): string {
    return `${environment.hostUrl}product`;
  }

  public productSuggest(code: string): string {
    return `${environment.hostUrl}product/${code}/suggest`;
  }

  public cartListSaved(): string {
    return `${environment.hostUrl}cartData`;
  }

  public modelPath(): string {
    return `${environment.hostUrl}assets/cart-1a/model.json`;
  }

  public getModel(): Promise<LayersModel> {
    // return tf.loadModel(this.modelPath());
    return loadLayersModel(this.modelPath());
  }
}
