import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Order, PageControl } from '@models/application';
import { User } from '@models/user';
import { UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-table-partners',
  templateUrl: './table-partners.component.html',
  styleUrl: './table-partners.component.scss',
})
export class TablePartnersComponent {

  @Input()
  validation? : string = '';

  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onUserClick: EventEmitter<User> = new EventEmitter<User>();

  @Output()
  onRequestClick: EventEmitter<User> = new EventEmitter<User>();

  @Output()
  onDeleteUserClick: EventEmitter<User> = new EventEmitter<User>();

  public users: User[] = [];

  public columns = [
    {
      slug: 'name',
      order: true,
      title: 'Nome',
      align: 'start',
    },
    {
      slug: 'email',
      order: true,
      title: 'E-mail',
      align: 'justify-content-center',
    },
    {
      slug: 'company_name',
      order: true,
      title: 'Empresa',
      align: 'justify-content-center',
    },
    // {
    //   slug: 'cnpj',
    //   order: true,
    //   title: 'CNPJ',
    //   align: 'justify-content-center',
    // },
    // {
    //   slug: 'creci',
    //   order: true,
    //   title: 'CRECI',
    //   align: 'justify-content-center',
    // },
    {
      slug: 'phone',
      order: true,
      title: 'Telefone',
      align: 'justify-content-center',
    },
    {
      slug: 'created_at',
      order: true,
      title: 'Data da Solicitação',
      align: 'justify-content-center',
    },
    {
      slug: 'status',
      order: true,
      title: 'Status',
      align: 'justify-content-center',
    },
    {
      slug: 'active',
      order: true,
      title: 'Ativo',
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
    private readonly _userService: UserService
  ) {}

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

    this._userService
      .getList(this.pageControl, { ...this.filters, role: 'Client' })
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe((res) => {
        this.users = res.data;

        this.pageControl.page = res.current_page - 1;
        this.pageControl.itemCount = res.total;
        this.pageControl.pageCount = res.last_page;
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
