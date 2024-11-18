import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Order, PageControl} from '@models/application';
import {RequestOrder, RequestOrderStatus} from '@models/requestOrder';
import {OrderService} from '@services/order.service';
import {ToastrService} from 'ngx-toastr';
import {finalize, Subscription} from 'rxjs';

@Component({
  selector: 'app-table-orders',
  templateUrl: './table-orders.component.html',
  styleUrl: './table-orders.component.scss'
})
export class TableOrdersComponent {

  private subscription: Subscription;
  protected orderStatus = RequestOrderStatus;

  @Input()
  filters;

  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Output()
  public onViewOrder = new EventEmitter<any>();

  @Output()
  public onEditOrder = new EventEmitter<any>();

  @Output()
  public onDeleteOrder = new EventEmitter<RequestOrder>();


  public columns = [
    {
      slug: "order_type",
      order: false,
      title: "Tipo de Solicitação",
      classes: "",
    },
    {
      slug: "supplier_id",
      order: false,
      title: "Fornecedor",
      classes: "",
    },
    {
      slug: "user_id",
      order: false,
      title: "Solicitante",
      classes: "",
    },
    {
      slug: "total_value",
      order: false,
      title: "Valor",
      classes: "",
    },
    {
      slug: "construction_id",
      order: false,
      title: "Obra",
      classes: "",
    },
    {
      slug: "purchase_status",
      order: false,
      title: "Status",
      classes: "",
    },
    {
      slug: "actions",
      order: false,
      title: "Ações",
      classes: "justify-content-end me-5",
    },
  ];

  public orders: RequestOrder[] = [];

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };
  @Input() home!: boolean;

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _orderService: OrderService
  ) {
  }

  ngOnInit(): void {
    // this.subscription = this._sidebarService.accountIdAlterado$.subscribe(
    //   () => { this._onSearch() }
    // );

    if (this.home) {
      this.columns.pop();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {filters, searchTerm, loading} = changes;

    if (searchTerm?.previousValue && searchTerm?.currentValue !== searchTerm?.previousValue) {
      this._onSearch();
    } else if (!loading?.currentValue) {
      this._onSearch();
    } else if (filters?.previousValue && filters?.currentValue) {
      this._onSearch();
    }

  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  get getLoading() {
    return !!this.loading;
  }

  private _onSearch() {
    this.pageControl.search_term = this.searchTerm;
    this.pageControl.page = 1;
    this.search();
  }

  search(): void {
    this._initOrStopLoading();

    this._orderService
      .getOrders(this.pageControl, this.filters)
      .pipe(finalize(() => {
        this._initOrStopLoading()
      }))
      .subscribe((res) => {
        this.orders = res.data;

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

  pageEvent($event) {
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
    this.search();
  }

}
