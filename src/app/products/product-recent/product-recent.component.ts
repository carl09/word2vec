import { Component, Input } from '@angular/core';
import { IProductViewed } from '../../services/models/products.model';

@Component({
  selector: 'app-product-recent',
  templateUrl: './product-recent.component.html',
  styleUrls: ['./product-recent.component.scss'],
})
export class ProductRecentComponent {
  @Input() public productViewed: IProductViewed[];
}
