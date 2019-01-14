import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginAction } from '../../services/reducers/actions/user.actions';

@Component({
  selector: 'app-user-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<any>,
  ) {
    this.createForm();
  }

  public onSubmit() {
    console.log(this.loginForm.value);

    this.store.dispatch(
      new LoginAction({
        username: this.loginForm.value['email'],
      }),
    );

    this.router.navigate(['/products']);
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: '',
    });
  }
}
