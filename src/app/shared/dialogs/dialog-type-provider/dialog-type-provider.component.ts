import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SupplierType } from '@models/supplier';
import { TypeProviderService } from '@services/type-provider.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-type-provider',
  templateUrl: './dialog-type-provider.component.html',
  styleUrl: './dialog-type-provider.component.scss'
})
export class DialogTypeProviderComponent {

  public title: string = 'Tipos de fornecedor';

  public form: FormGroup;

  public loading : boolean = false;

  public isNotToUpdateTypes : boolean = true;

  constructor(
    private readonly _dialogRef : MatDialogRef<DialogTypeProviderComponent>,
    private readonly _typeProviderService :  TypeProviderService,
    private readonly _toastr : ToastrService,
    private readonly _fb : FormBuilder
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      type : [null, Validators.required]
    })
  }

  public addTypeProvider() {
    if(!this.form.valid) return;

    this._initOrStopLoading();

    this._typeProviderService.postTypeProvider({...this.form.getRawValue()})
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

  public deleteProviderType(providerType : SupplierType) {
    this._initOrStopLoading();

    this._typeProviderService.deleteTypeProvider(providerType.id)
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
