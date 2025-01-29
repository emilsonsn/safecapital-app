import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HeaderService } from '@services/header.service';
import { SettingService } from '@services/settings.service';
import { TaxSettingService } from '@services/tax-setting.service';
import { DialogSettingComponent } from '@shared/dialogs/dialog-setting/dialog-setting.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrl: './tax.component.scss',
})
export class TaxComponent {
  protected form: FormGroup;
  protected loading: boolean = false;

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _taxSettingService: TaxSettingService,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService
  ) {
    this._headerService.setTitle('Configurações de Taxa');
    this._headerService.setSubTitle('');
  }

  ngOnInit() {
    this.form = this._fb.group({
      percentage: [null, [Validators.required, Validators.min(0.01)]],
      tax: [null, [Validators.required]],
    });

    this.getSettings();
  }

  protected onSubmit() {
    this._initOrStopLoading();

    this._taxSettingService
      .patch(1, this.form.getRawValue())
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  protected getSettings() {
    this._initOrStopLoading();

    this._taxSettingService
      .getList()
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this.form.patchValue(res);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }
}
