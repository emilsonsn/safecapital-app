import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {DialogCollaboratorComponent} from '@shared/dialogs/dialog-collaborator/dialog-collaborator.component';
import {DialogConfirmComponent} from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs';
import {ISmallInformationCard} from '@models/cardInformation';
import {User} from '@models/user';
import {UserService} from '@services/user.service';

@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrl: './collaborator.component.scss',
})
export class CollaboratorComponent {
  public loading: boolean = false;

  protected itemsRequests: ISmallInformationCard[] = [
    {
      icon: 'fa-solid fa-circle-check',
      background: '#4CA750',
      title: '0',
      category: 'Colaboradores',
      description: 'Colaboradores ativos',
    },
    {
      icon: 'fa-solid fa-ban',
      background: '#dc3545',
      title: '0',
      category: 'Colaboradores',
      description: 'Colaboradores bloqueados',
    },
    {
      icon: 'fa-solid fa-users',
      // background: '#dc3545',
      title: '0',
      category: 'Colaboradores',
      description: 'Colaboradores totais',
    },
  ]

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _router: Router,
    private readonly _userService: UserService
  ) {
  }

  ngOnInit(): void {
    this._getCards();
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  openDialogCollaborator(user?: User) {
    this._dialog
      .open(DialogCollaboratorComponent, {
        data: {user},
        width: '80%',
        maxWidth: '850px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const id = +res.get('id');
          if (id) {
            this._patchCollaborator(res);
            return;
          }

          this._postCollaborator(res);
        }
      });
  }

  _getCards() {
    this._initOrStopLoading();

    this._userService
      .getCards()
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          this.itemsRequests = [
            {
              icon: 'fa-solid fa-circle-check',
              background: '#4CA750',
              title: `${res.data.active}`,
              category: 'Colaboradores',
              description: 'Colaboradores ativos',
            },
            {
              icon: 'fa-solid fa-ban',
              background: '#dc3545',
              title: `${res.data.inactive}`,
              category: 'Colaboradores',
              description: 'Colaboradores bloqueados',
            },
            {
              icon: 'fa-solid fa-users',
              // background: '#dc3545',
              title: `${res.data.total}`,
              category: 'Colaboradores',
              description: 'Colaboradores totais',
            },
          ]
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  _patchCollaborator(collaborator: FormData) {
    this._initOrStopLoading();
    const id = +collaborator.get('id');
    this._userService
      .patchUser(id, collaborator)
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

  _postCollaborator(collaborator: User) {
    this._initOrStopLoading();

    this._userService
      .postUser(collaborator)
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

  onDeleteCollaborator(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, {data: {text}})
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteCollaborator(id);
        }
      });
  }

  _deleteCollaborator(id: number) {
    this._initOrStopLoading();
    this._userService
      .deleteUser(id)
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
