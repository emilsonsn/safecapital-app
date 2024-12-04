import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { ISmallInformationCard } from '@models/cardInformation';
import { User } from '@models/user';
import { UserService } from '@services/user.service';
import { HeaderService } from '@services/header.service';
import { FormGroup } from '@angular/forms';
import { DialogUserComponent } from '@shared/dialogs/dialog-user/dialog-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  // Utils
  public loading: boolean = false;

  // Form
  public formFilters: FormGroup;

  // Filters
  public searchTerm: string = '';
  public filters;

  // Cards
  protected itemsRequests: ISmallInformationCard[] = [
    {
      icon: 'fa-solid fa-circle-check',
      background: '#4CA750',
      title: '0',
      category: 'Usuários',
      description: 'Usuários ativos',
    },
    {
      icon: 'fa-solid fa-ban',
      background: '#dc3545',
      title: '0',
      category: 'Usuários',
      description: 'Usuários bloqueados',
    },
    {
      icon: 'fa-solid fa-users',
      // background: '#dc3545',
      title: '0',
      category: 'Usuários',
      description: 'Usuários totais',
    },
  ];

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _router: Router,
    private readonly _userService: UserService,
    private readonly _headerService: HeaderService
  ) {
    this._headerService.setTitle('Usuários');
    this._headerService.setSubTitle('');
  }

  ngOnInit(): void {
    // this.getUsersCards();
  }

  protected openUserDialog(user?: User) {
    this._dialog
      .open(DialogUserComponent, {
        data: {
          user,
        },
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

  protected openConfirmDeleteUserDialog(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this.deleteUser(id);
        }
      });
  }

  private deleteUser(id: number) {
    this._userService.deleteUser(id).subscribe({
      next: (res) => {
        this._toastr.success(res.message);
        if (res) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
          }, 200);
        }
      },
      error: (err) => {
        this._toastr.error(err.error.error);
      },
    });
  }

  // Filters
  public updateFilters() {
    this.filters = this.formFilters.getRawValue();
  }

  public clearFormFilters() {
    this.formFilters.patchValue({
      search_term: '',
    });
    this.updateFilters();
  }

  protected handleSearchTerm(res) {
    this.searchTerm = res;
  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  // Cards
  protected getUsersCards() {
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
              category: 'Usuários',
              description: 'Usuários ativos',
            },
            {
              icon: 'fa-solid fa-ban',
              background: '#dc3545',
              title: `${res.data.inactive}`,
              category: 'Usuários',
              description: 'Usuários bloqueados',
            },
            {
              icon: 'fa-solid fa-users',
              // background: '#dc3545',
              title: `${res.data.total}`,
              category: 'Usuários',
              description: 'Usuários totais',
            },
          ];
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }
}
