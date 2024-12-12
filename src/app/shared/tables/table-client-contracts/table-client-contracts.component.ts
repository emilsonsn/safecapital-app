import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Order, PageControl } from '@models/application';
import { Client } from '@models/client';
import { ClientService } from '@services/client.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-table-client-contracts',
  templateUrl: './table-client-contracts.component.html',
  styleUrl: './table-client-contracts.component.scss',
})
export class TableClientContractsComponent {
  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onClientClick: EventEmitter<Client> = new EventEmitter<Client>();

  @Output()
  onContractsClientClick: EventEmitter<Client> = new EventEmitter<Client>();

  @Output()
  onDeleteClientClick: EventEmitter<number> = new EventEmitter<number>();

  public clients = [];

  public columns = [
    {
      slug: 'contract',
      order: true,
      title: 'Contrato',
      align: 'start',
    },
    {
      slug: 'created_at',
      order: true,
      title: 'Criado em',
      align: 'start',
    },
    // {
    //   slug: '',
    //   order: true,
    //   title: 'Ações',
    //   align: 'justify-content-center',
    // },
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
    private readonly _clientService: ClientService
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
