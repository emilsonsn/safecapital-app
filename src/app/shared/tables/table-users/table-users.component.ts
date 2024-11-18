import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Order, PageControl } from '@models/application';
import { User } from '@models/user';
import { UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-table-users',
  templateUrl: './table-users.component.html',
  styleUrl: './table-users.component.scss'
})
export class TableUserComponent {
  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onUserClick: EventEmitter<User> = new EventEmitter<User>();

  @Output()
  onDeleteUserClick: EventEmitter<number> = new EventEmitter<number>();

  public users: User[] = [];

  public columns = [
    {
      slug: "name",
      order: true,
      title: "Nome",
      align: "start",
    },
    {
      slug: "cpf_cnpj",
      order: true,
      title: "CPF/CNPJ",
      align: "justify-content-center",
    },
    {
      slug: "birth_date",
      order: true,
      title: "Data de nascimento",
      align: "justify-content-center",
    },
    {
      slug: "position",
      order: true,
      title: "Cargo",
      align: "justify-content-center",
    },
    {
      slug: "sector",
      order: true,
      title: "Setor",
      align: "justify-content-center",
    },
    {
      slug: "cellphone",
      order: true,
      title: "Whatsapp",
      align: "justify-content-center",
    },
    {
      slug: "email",
      order: true,
      title: "E-mail",
      align: "justify-content-center",
    },
    {
      slug: "",
      order: true,
      title: "Ações",
      align: "justify-content-center",
    },
  ];

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _userService: UserService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { filters, searchTerm, loading } = changes;

    if ( searchTerm?.previousValue && searchTerm?.currentValue !== searchTerm?.previousValue ) {
      this._onSearch();
    }
    else if (!loading?.currentValue) {
      this._onSearch();
    }
    else if(filters?.previousValue && filters?.currentValue) {
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
      .getUsers(this.pageControl, this.filters)
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
