import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Order, PageControl } from '@models/application';
import { Settings } from '@models/settings';
import { User } from '@models/user';
import { SettingService } from '@services/settings.service';
import { UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-table-settings',
  templateUrl: './table-settings.component.html',
  styleUrl: './table-settings.component.scss',
})
export class TableSettingsComponent {

  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onSettingClick: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  onDeleteSettingClick: EventEmitter<number> = new EventEmitter<number>();

  public settings: Settings[] = [];

  public columns = [
    {
      slug: 'description',
      order: true,
      title: 'Descrição',
      align: 'start',
    },
    {
      slug: 'start_score',
      order: true,
      title: 'Score inicial',
      align: 'justify-content-center',
    },
    {
      slug: 'end_score',
      order: true,
      title: 'Score final',
      align: 'justify-content-center',
    },
    {
      slug: 'has_pending_issues',
      order: true,
      title: 'Possui pendências',
      align: 'justify-content-center',
    },
    {
      slug: 'Status',
      order: true,
      title: 'Status indicado',
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
    private readonly _settingService: SettingService
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

    this._settingService
      .getList(this.pageControl, { search_term: this.searchTerm, ...this.filters}) // , role: 'Client'
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe((res) => {
        this.settings = res.data;

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
