import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ISmallInformationCard } from '@models/cardInformation';
import { Supplier } from '@models/supplier';
import { SupplierService } from '@services/supplier.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogProviderComponent } from '@shared/dialogs/dialog-provider/dialog-provider.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrl: './provider.component.scss'
})
export class ProviderComponent {

  public loading: boolean = false;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _providerService: SupplierService
  ) {}

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  openDialogProvider(provider?: Supplier) {
    this._dialog
      .open(DialogProviderComponent, {
        data: { provider },
        width: '80%',
        maxWidth: '850px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          if (res.id) {
            this._patchProvider(res);
            return;
          }

          this._postProvider(res);
        }
      });
  }

  _patchProvider(provider: Supplier) {
    this._initOrStopLoading();

    this._providerService
      .patchSupplier(provider.id, provider)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  _postProvider(provider: Supplier) {
    this._initOrStopLoading();

    this._providerService
      .postSupplier(provider)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  onDeleteProvider(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteProvider(id);
        }
      });
  }

  _deleteProvider(id: number) {
    this._initOrStopLoading();
    this._providerService
      .deleteSupplier(id)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }
}

