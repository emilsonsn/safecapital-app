import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Order, PageControl } from '@models/application';
import { SupplierType } from '@models/supplier';
import { TypeProviderService } from '@services/type-provider.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subscription } from 'rxjs';

@Component({
  selector: 'app-table-type-provider',
  templateUrl: './table-type-provider.component.html',
  styleUrl: './table-type-provider.component.scss'
})
export class TableTypeProviderComponent {

  private subscription: Subscription;

  @Input()
  filters;

  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Output()
  public onDeleteProviderType = new EventEmitter<SupplierType>();


  public columns = [
    {
      slug: "id",
      order: false,
      title: "ID",
      classes: "",
    },
    {
      slug: "name",
      order: false,
      title: "Nome",
      classes: "",
    },
    {
      slug: "actions",
      order: false,
      title: "Ações",
      classes: "justify-content-end me-5",
    },
  ];

  public providerTypes : SupplierType[] = [];

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
    private readonly _providerTypeService : TypeProviderService
  ) { }

  ngOnInit(): void { }

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
    this.pageControl.search_term = this.searchTerm;
    this.pageControl.page = 1;
    this.search();
  }

  search(): void {
    this._initOrStopLoading();

    this._providerTypeService.getTypes()
      .pipe(finalize(() => { this._initOrStopLoading() }))
      .subscribe({
        next: (res) => {
          this.providerTypes = res.data;

          this.pageControl.page = res.current_page - 1;
          this.pageControl.itemCount = res.total;
          this.pageControl.pageCount = res.last_page;
        }
      })
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
