import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserSector } from '@models/user';
import { ServiceService } from '@services/service.service';
import { UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-type-user-sector',
  templateUrl: './dialog-type-user-sector.component.html',
  styleUrl: './dialog-type-user-sector.component.scss'
})
export class DialogTypeUserSectorComponent {

  public title: string = 'Setores do Usuário';

  public form: FormGroup;

  public loading : boolean = false;

  public isNotToUpdateTypes : boolean = true;

  constructor(
    private readonly _dialogRef : MatDialogRef<DialogTypeUserSectorComponent>,
    private readonly _userService : UserService,
    private readonly _toastr : ToastrService,
    private readonly _fb : FormBuilder
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      sector : [null, Validators.required]
    })
  }

  public addTypeProvider() {
    if(!this.form.valid) return;

    this._initOrStopLoading();

    this._userService.postSectorUser({...this.form.getRawValue()})
      .pipe(finalize(() => { this._initOrStopLoading() }))
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
          this.isNotToUpdateTypes = false;
          this.form.reset();
        },
        error: (err) => {
          this._toastr.error(err.message);
        }
      })
  }

  public deleteServiceType(userSector : UserSector) {
    this._initOrStopLoading();

    this._userService.deleteSectorUser(userSector.id)
      .pipe(finalize(() => {
        this._initOrStopLoading();
        this.isNotToUpdateTypes = false;
      }))
      .subscribe({
        next : (res) => {
          this._toastr.success(res.message);
        },
        error : (err) => {
          this._toastr.error(err.message);
        }
      })
  }

  public onCancel(): void {
    this._dialogRef.close(this.isNotToUpdateTypes);
  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

}
