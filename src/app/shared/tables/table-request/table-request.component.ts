import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Order, PageControl } from '@models/application';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subscription } from 'rxjs';
import { Request } from '@models/request';
import { RequestService } from '@services/request.service';
import { SessionQuery } from '@store/session.query';

@Component({
  selector: 'app-table-request',
  templateUrl: './table-request.component.html',
  styleUrl: './table-request.component.scss'
})
export class TableRequestComponent {

  private subscription: Subscription;

  @Input()
  filters;

  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Output()
  public onViewOrder = new EventEmitter<Request>();

  @Output()
  public onOpenOrder = new EventEmitter<Request>();

  @Output()
  public onDeleteOrder = new EventEmitter<Request>();

  @Output()
  public onOrderModal = new EventEmitter<Request>();

  public columns = [
    {
      slug: "request_type",
      order: false,
      title: "Tipo de Solicitação",
      classes: "",
    },
    {
      slug: "amount",
      order: false,
      title: "Valor",
      classes: "",
    },
    {
      slug: "status",
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

  public requests : Request[] = [];

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };

  isFinancial: boolean = false;

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _requestService : RequestService,
    private readonly _sessionQuery : SessionQuery
  ) {}

  ngOnInit(): void {
    // this.subscription = this._sidebarService.accountIdAlterado$.subscribe(
    //   () => { this._onSearch() }
    // );

    this.loadPermissions();
  }

  public loadPermissions(){
    this._sessionQuery.user$.subscribe(user => {
      if(user && (user?.company_position.position === 'Financial' || user?.company_position.position === 'Admin')) {
        this.isFinancial = true;
      }
    })
  }

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

    this._requestService
      .getRequests(this.pageControl, this.filters)
      .pipe(finalize(() => {
        this._initOrStopLoading()
      }))
      .subscribe((res) => {
        this.requests = res.data;

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
