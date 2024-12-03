import { Component } from '@angular/core';
import { RegisterAutenticateEmitter } from '../register-autenticate/register-autenticate.component';
import { User } from '@models/user';

@Component({
  selector: 'app-register-manager',
  templateUrl: './register-manager.component.html',
  styleUrl: './register-manager.component.scss'
})
export class RegisterManagerComponent {

  protected autenticateState : boolean = true;
  protected loading : boolean = true;
  protected user : User = null;

  constructor(

  ) {}

  ngOnInit() {

  }

  protected handleIsNewUser(e : RegisterAutenticateEmitter) {
    this.user = e.user;

    setTimeout(() => {
      this.autenticateState = false;
    }, 200);
  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

}
