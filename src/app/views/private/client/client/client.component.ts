import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Client, ClientStatus } from '@models/client';
import { ClientService } from '@services/client.service';
import { DialogClientComponent } from '@shared/dialogs/dialog-client/dialog-client.component';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  finalize,
  map,
  ReplaySubject,
  Subject,
  takeUntil,
} from 'rxjs';
import { HeaderService } from '@services/header.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { User } from '@models/user';
import { UserService } from '@services/user.service';
import { SessionQuery } from '@store/session.query';
import { DialogClientContractsComponent } from '@shared/dialogs/dialog-client-contracts/dialog-client-contracts.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
})
export class ClientComponent {
  protected _onDestroy = new Subject<void>();
  protected user: User;
  public formFilters: FormGroup;
  public filters;
  public loading: boolean = false;
  protected searchTerm: string = '';

  // Filters
  protected statusSelect: string[] = Object.values(ClientStatus);

  protected userSelect: User[] = [];

  protected partnerCtrl: FormControl<any> = new FormControl<any>(null);
  protected partnerFilterCtrl: FormControl<any> = new FormControl<string>('');
  protected filteredPartners: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _clientService: ClientService,
    private readonly _headerService: HeaderService,
    private readonly _fb: FormBuilder,
    private readonly _userService: UserService,
    protected readonly _sessionQuery: SessionQuery
  ) {
    this._headerService.setTitle('Clientes');
    this._headerService.setSubTitle('');

    this._sessionQuery.user$.subscribe((user) => {
      this.user = user;
    });

    this.getUsersFromBack();
  }

  ngOnInit(): void {
    this.formFilters = this._fb.group({
      status: [''],
      user_id: [''],
    });
  }

  protected openClientDialog(client?: Client) {
    this._dialog
      .open(DialogClientComponent, {
        data: { client },
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

  protected openContractClientDialog(client?: Client) {
    this._dialog
      .open(DialogClientContractsComponent, {
        data: { client },
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

  protected onDeleteConfirm(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this.deleteClient(id);
        }
      });
  }

  protected deleteClient(id: number) {
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

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  // Filters
  public updateFilters() {
    this.filters = this.formFilters.getRawValue();
  }

  public clearFormFilters() {
    this.formFilters.patchValue({
      status: '',
      user_id : '',
    });
    this.updateFilters();
  }

  protected handleSearchTerm(res) {
    this.searchTerm = res;
  }

  protected prepareFilterClientCtrl() {
    this.partnerFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.userSelect
              .filter((user) => user.role.toLowerCase() == 'client')
              .slice();
          } else {
            search = search.toLowerCase();
            return this.userSelect.filter(
              (user) =>
                user.role.toLowerCase() == 'client' &&
                user.name.toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredPartners.next(filtered);
      });
  }

  // Getters

  public getUsersFromBack() {
    this._userService.getUsers().subscribe((res) => {
      this.userSelect = res.data;

      this.filteredPartners.next(
        this.userSelect
          .filter((user) => user.role.toLowerCase() == 'client')
          .slice()
      );

      this.prepareFilterClientCtrl();
    });
  }
}
