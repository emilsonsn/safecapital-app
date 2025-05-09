import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Order, PageControl } from '@models/application';
import { Client, ClientStatus } from '@models/client';
import { User, UserRole } from '@models/user';
import { ClientService } from '@services/client.service';
import { SessionQuery } from '@store/session.query';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-table-client',
  templateUrl: './table-client.component.html',
  styleUrl: './table-client.component.scss',
})
export class TableClientComponent {

  // Utils
  protected myUser : User;
  protected UserRoleEnum = UserRole;

  protected clientStatus = ClientStatus;

  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onClientClick: EventEmitter<Client> = new EventEmitter<Client>();

  @Output()
  onClientApproveClick: EventEmitter<Client> = new EventEmitter<Client>();

  @Output()
  onClientContractsClick: EventEmitter<Client> = new EventEmitter<Client>();

  @Output()
  onDeleteClientClick: EventEmitter<Client> = new EventEmitter<Client>();

  public clients = [];

  public columns = [
    {
      slug: 'name',
      order: true,
      title: 'Nome',
      align: 'start',
    },
    {
      slug: 'phone',
      order: true,
      title: 'Whatsapp',
      align: 'justify-content-center',
    },
    {
      slug: 'Telefone',
      order: true,
      title: 'E-mail',
      align: 'justify-content-center',
    },
    {
      slug: 'cpf',
      order: true,
      title: 'CPF',
      align: 'justify-content-center',
    },
    {
      slug: 'status',
      order: true,
      title: 'Status',
      align: 'justify-content-center',
    },
    {
      slug: '',
      order: true,
      title: 'Ações',
      align: 'justify-content-center',
    },
  ];

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: 'id',
    order: Order.ASC,
  };

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _clientService: ClientService,
    private readonly _sessionQuery : SessionQuery
  ) {}

  ngOnInit() {
    this._sessionQuery.user$.subscribe(user => {
      this.myUser = user;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { filters, searchTerm, loading } = changes;

    if (
      searchTerm?.previousValue &&
      searchTerm?.currentValue !== searchTerm?.previousValue
    ) {
      this._onSearch();
    } else if (!loading?.currentValue) {
      this._onSearch();
    } else if (filters?.previousValue && filters?.currentValue) {
      this._onSearch();
    }
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  get getLoading() {
    return !!this.loading;
  }

  private _onSearch() {
    this.pageControl.search_term = this.searchTerm || '';
    this.pageControl.page = 1;
    this.search();
  }

  search(): void {
    this._initOrStopLoading();

    this._clientService
      .getList(this.pageControl, this.filters)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          this.clients = res.data;

          this.pageControl.page = res.current_page - 1;
          this.pageControl.itemCount = res.total;
          this.pageControl.pageCount = res.last_page;
        },
        error: (err) => {
          this._toastr.error(
            err?.error?.message || 'Ocorreu um erro ao buscar os dados'
          );
        },
      });
  }

  onClickOrderBy(slug: string, order: boolean) {
    if (!order) {
      return;
    }

    if (this.pageControl.orderField === slug) {
      this.pageControl.order =
        this.pageControl.order === Order.ASC ? Order.DESC : Order.ASC;
    } else {
      this.pageControl.order = Order.ASC;
      this.pageControl.orderField = slug;
    }
    this.pageControl.page = 1;
    this.search();
  }

  pageEvent($event: any) {
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
    this.search();
  }
}
