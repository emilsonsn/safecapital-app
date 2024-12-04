import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserService } from '@services/user.service';
import { User } from '@models/user';
import { Utils } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { SessionQuery } from '@store/session.query';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrl: './dialog-user.component.scss',
})
export class DialogUserComponent {

  // Utils
  protected myUser: User;
  protected title: string = 'Novo ';
  protected isNewUser: boolean = true;
  protected utils = Utils;
  protected loading: boolean = false;

  // Form
  protected form: FormGroup;

  protected canEdit: boolean = true;

  // Selects
  protected statusSelect: { label: string; value: number }[] = [
    {
      label: 'Ativo',
      value: 1,
    },
    {
      label: 'Inativo',
      value: 0,
    },
  ];

  protected userPermissionSelect: { label: string; value: string }[] = [
    {
      label: 'Admin',
      value: 'Admin',
    },
    {
      label: 'Colaborador',
      value: 'Manager',
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data: { user: User },
    private readonly _dialogRef: MatDialogRef<DialogUserComponent>,
    private readonly _fb: FormBuilder,
    private readonly _dialog: MatDialog,
    private readonly _userService: UserService,
    private readonly _toastr: ToastrService,
    private readonly _sessionQuery: SessionQuery
  ) {}

  ngOnInit(): void {
    this._sessionQuery.user$.subscribe((user) => {
      this.myUser = user;
    });

    this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      is_active: [1],
      role: ['Manager'],

      // Campos requeridos no back mas desnecessários
      company_name: ['null'],
      creci: ['null'],
      cnpj: ['null'],
    });

    if (this._data?.user) {
      this.isNewUser = false;
      this.title = 'Editar ';
      this.form.patchValue(this._data.user);
    }
  }

  public onSubmit(form: FormGroup): void {
    if (!form.valid || this.loading) {
      form.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    Object.entries(form.controls).forEach(([key, control]) => {
      formData.append(key, control.value);
    });

    if (this.isNewUser) {
      this.post(formData);
    } else {
      this.patch(formData);
    }
  }

  protected patch(user: FormData) {
    this._initOrStopLoading();

    const id = +user.get('id');

    this._userService
      .patchUser(id, user)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
            this._dialogRef.close(true);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  protected post(user: FormData) {
    this._initOrStopLoading();

    this._userService
      .postUser(user)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
            this._dialogRef.close(true);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  // Utils
  public onCancel(): void {
    this._dialogRef.close();
  }

  protected _initOrStopLoading() {
    this.loading = !this.loading;
  }
}
