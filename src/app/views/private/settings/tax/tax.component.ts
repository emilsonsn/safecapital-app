import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HeaderService } from '@services/header.service';
import { SettingService } from '@services/settings.service';
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
    private readonly _settingsService: SettingService,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _dialog: MatDialog
  ) {
    this._headerService.setTitle('Configurações');
    this._headerService.setSubTitle('');
  }

  ngOnInit() {
    this.form = this._fb.group({
      percentage: [null, [Validators.required]],
      tax: [null, [Validators.required]],
    });

    this.getSettings();
  }

  protected onSubmit() {

  }

  protected getSettings() {
    this._initOrStopLoading();

    this._settingsService
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
