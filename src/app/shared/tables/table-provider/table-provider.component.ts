import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Order, PageControl } from '@models/application';
import { Supplier, SupplierType } from '@models/supplier';
import { SupplierService } from '@services/supplier.service';
import { TypeProviderService } from '@services/type-provider.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-table-provider',
  templateUrl: './table-provider.component.html',
  styleUrl: './table-provider.component.scss'
})
export class TableProviderComponent {

  public typeSuppliers : SupplierType[] = []

  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onProviderClick: EventEmitter<Supplier> =
    new EventEmitter<Supplier>();

  @Output()
  onDeleteProviderClick: EventEmitter<number> =
    new EventEmitter<number>();

  public providers: Supplier[] = [];

  public columns = [
    {
      slug: "bussiness_name",
      order: true,
      title: "Razão social",
      align: "start",
    },
    {
      slug: "cnpj",
      order: true,
      title: "CNPJ",
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
      slug: "type",
      order: true,
      title: "Tipo de fornecedor",
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
    private readonly _providerService: SupplierService,
    private readonly _typeProviderService : TypeProviderService
  ) {}

  ngOnInit() {
    this.getTypeProviders();
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

    this._providerService
      .getSuppliers(this.pageControl, this.filters)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe((res) => {
        this.providers = res.data;

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

  // Utils
  public getTypeProviders() {
    this._typeProviderService.getTypes()
      .subscribe(res => {
        this.typeSuppliers = res.data;
      })
  }

  public transformIdIntoProvider(id : number) {
    return this.typeSuppliers?.find(p => p?.id == id)?.type;
  }

}

