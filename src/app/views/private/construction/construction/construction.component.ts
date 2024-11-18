import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Construction } from '@models/construction';
import { ConstructionService } from '@services/construction.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogConstructionComponent } from '@shared/dialogs/dialog-construction/dialog-construction.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-construction',
  templateUrl: './construction.component.html',
  styleUrl: './construction.component.scss'
})
export class ConstructionComponent {
  public loading: boolean = false;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _constructionService: ConstructionService,
  ) {}

  openDialogConstruction(construction?: Construction) {
    this._dialog
      .open(DialogConstructionComponent, {
        data: { construction },
        width: '80%',
        maxWidth: '850px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          if (res.id) {
            this._patchConstruction(res);
            return;
          }

          this._postConstruction(res);
        }
      });
  }

  _patchConstruction(construction: Construction) {
    this._initOrStopLoading();

    this._constructionService
      .patchConstruction(construction.id, construction)
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

  _postConstruction(construction: Construction) {
    this._initOrStopLoading();

    this._constructionService
      .postConstruction(construction)
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

  onDeleteConstruction(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteConstruction(id);
        }
      });
  }

  _deleteConstruction(id: number) {
    this._initOrStopLoading();
    this._constructionService
      .deleteConstruction(id)
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

  // Utils

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }
}



