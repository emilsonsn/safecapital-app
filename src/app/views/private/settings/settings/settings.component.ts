import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderService } from '@services/header.service';
import { SettingService } from '@services/settings.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  protected form: FormGroup;
  protected loading: boolean = false;

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _settingsService: SettingService,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService
  ) {
    this._headerService.setTitle('Configurações');
    this._headerService.setSubTitle('');
  }

  ngOnInit() {
    this.form = this._fb.group({
      start_approved_score: [null, [Validators.required]],
      end_approved_score: [null, [Validators.required]],
      start_pending_score: [null, [Validators.required]],
      end_pending_score: [null, [Validators.required]],
      start_disapproved_score: [null, [Validators.required]],
      end_disapproved_score: [null, [Validators.required]],
    });

    this.getSettings();
  }

  protected onSubmit() {
    if (!this.form.valid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this._initOrStopLoading();

    this._settingsService
      .patch(this.form.getRawValue())
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
          this.getSettings();
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
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
