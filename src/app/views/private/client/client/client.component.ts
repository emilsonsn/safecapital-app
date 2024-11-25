import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Client } from '@models/client';
import { ClientService } from '@services/client.service';
import { DialogPartnerComponent } from '@shared/dialogs/dialog-partner/dialog-partner.component';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {
  public loading: boolean = false;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _clientService: ClientService
  ) {}

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  openDialogClient(service?: Client) {
    this._dialog
      .open(DialogPartnerComponent, {
        data: { service },
        width: '80%',
        maxWidth: '850px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
          }, 200);
        }
      });
  }

  onDeleteClient(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteClient(id);
        }
      });
  }

  _deleteClient(id: number) {
    this._initOrStopLoading();
    this._clientService
      .deleteClient(id)
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

