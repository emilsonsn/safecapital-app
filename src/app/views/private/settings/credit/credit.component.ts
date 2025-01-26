import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HeaderService } from '@services/header.service';
import { SettingService } from '@services/settings.service';
import { DialogSettingComponent } from '@shared/dialogs/dialog-setting/dialog-setting.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrl: './credit.component.scss',
})
export class CreditComponent {
  protected form: FormGroup;
  protected loading: boolean = false;
  protected searchTerm: string = '';

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _settingsService: SettingService,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _dialog: MatDialog,

  ) {
    this._headerService.setTitle('Configurações de Crédito');
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

  handleSearchTerm(string){

  }

  openSettingDialog(setting?){
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '850px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogSettingComponent, {
        data: setting ? { ...setting } : null,
        ...dialogConfig,
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
            }, 200);
          }
        },
      });
  }

  deleteSetting(id){
    this._settingsService.delete(id)
    .subscribe({
      next: (res) => {
        this._toastr.success(res.message);
        if (res) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.getSettings();
          }, 200);
        }
      },
      error: (err) => {
        this._toastr.error(err.error.error);
      },
    })
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
