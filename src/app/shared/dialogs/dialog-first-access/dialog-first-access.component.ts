import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  afterNextRender,
  Component,
  inject,
  Inject,
  Injector,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '@models/user';
import { SolicitationService } from '@services/solicitation.service';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';
import { Utils } from '@shared/utils';
import { SessionQuery } from '@store/session.query';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-first-access',
  templateUrl: './dialog-first-access.component.html',
  styleUrl: './dialog-first-access.component.scss',
})
export class DialogFirstAccessComponent {
  public form: FormGroup;
  protected user : User;
  public loading: boolean = false;

  public utils = Utils;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogFirstAccessComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _utilsService: UtilsService,
    private readonly _sessionQuery: SessionQuery,
    private readonly _userService: UserService,
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      accept_terms: [null, [Validators.required]],
    });

    this._sessionQuery.user$.subscribe((user) => {
      this.user = user;
    });
  }

  public onSubmit(): void {
    if (!this.form.valid || this.loading) {
      this.form.markAllAsTouched();
      this._toastr.error('Necessário aceitar os termos de uso!');
      return;
    }

    this.post();
  }

  protected post() {
    this._initOrStopLoading();

    this._userService.acceptTerms()
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
          this._dialogRef.close(true);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      })
  }

  // protected prepareFormData(form: FormGroup) {
  //   const formData = new FormData();

  //   Object.entries(form.controls).forEach(([key, control]) => {
  //     formData.append(key, control.value);
  //   });

  //   return formData;
  // }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

}
