import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { StatusUser, User, UserRole } from '@models/user';
import { AuthService } from '@services/auth.service';
import { LocalStorageService } from '@services/local-storage.service';
import { UserService } from '@services/user.service';
import { Utils } from '@shared/utils';
import { SessionService } from '@store/session.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

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
    private readonly _toastr: ToastrService,
    private readonly _authService: AuthService,
    private readonly _storage: LocalStorageService,
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      email: [null, [Validators.required]],
      password: [{ value: null, disabled: true }, [Validators.required]],
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
    this._userService
      .getUserByEmail(this.form.get('email').value)
      .pipe(
        finalize(() => {
          if (this._user) {
            this.form.get('password').enable();
            this._searchUserState = false;
          } else {
            this.autenticateUser();
          }

          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._user = res.data;
        },
        error: (err) => {
          // this._toastr.error(err.error.error);
        },
      });
  }

  protected autenticateUser() {
    if (this._user) {
      const { email, password } = this.form.getRawValue();

      this._authService
        .login({ email, password })
        .pipe(
          finalize(() => {
            this._initOrStopLoading();
          })
        )
        .subscribe({
          next: (res) => {
            this._toastr.success('Seja bem vindo!');

            this._storage.set('access_token', res.access_token);

            this.AutenticateEmitter.emit({
              isNewUser: false,
              user: this._user,
            });
          },
          error: (err) => {
            this._toastr.error('Não foi possível autenticar o usuário!');
          },
        });

      return;
    }

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
