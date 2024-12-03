import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StatusUser, User, UserRole } from '@models/user';
import { UserService } from '@services/user.service';
import { Utils } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';

export interface RegisterAutenticateEmitter {
  isNewUser: boolean;
  user?: User;
}

@Component({
  selector: 'app-register-autenticate',
  templateUrl: './register-autenticate.component.html',
  styleUrl: './register-autenticate.component.scss',
})
export class RegisterAutenticateComponent {
  protected form: FormGroup;
  protected _searchUserState: boolean = true;
  protected _user: User = null;

  @Output()
  AutenticateEmitter: EventEmitter<RegisterAutenticateEmitter> =
    new EventEmitter<RegisterAutenticateEmitter>();

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _userService: UserService,
    private readonly _router: Router,
    private readonly _toastr: ToastrService
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      email: [null, [Validators.required]],
      password: [null],
    });
  }

  protected onSubmit() {
    if (!this.form.valid || this.loading) {
      this._toastr.error('Favor preencher os campos!');
      return;
    }

    this._initOrStopLoading();

    if (this._searchUserState) {
      this.searchForUser();
    } else {
      this.autenticateUser();
    }
  }

  protected searchForUser() {
    // Faz o search no endpoint específico para retornar o usuário que já se cadastrou
    // Se encontrar o usuário, adiciona password e atribui o usuário à user

    // this.user = User da requisição

    this._user = {
      name: 'a',
      phone: 'a',
      surname: 'a',
      company_name: 'a',
      cnpj: 'a',
      creci: 'a',
      email: 'a',
      password: 'a',
      is_active: true,
      role: UserRole.Client,
      validation: StatusUser.Pending,
    };

    // this._user = null;

    if (this._user) {
      setTimeout(() => {
        if (this._user) {
          this.form.addControl('password', Validators.required);
          this._searchUserState = false;
        }
      }, 500);
      this._initOrStopLoading();
    } else {
      this.autenticateUser();
    }
  }

  protected autenticateUser() {
    this.AutenticateEmitter.emit({
      isNewUser: this._user ? false : true,
      user: this._user ?? null,
    });

    this._initOrStopLoading();
  }

  // Utils
  protected loading: boolean = false;
  protected utils = Utils;

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public onCancel(): void {
    this._router.navigate(['/login']);
  }
}
