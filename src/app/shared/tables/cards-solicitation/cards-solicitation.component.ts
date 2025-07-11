import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Order, PageControl } from '@models/application';
import { Solicitation, SolicitationStatusEnum } from '@models/solicitation';
import { SolicitationService } from '@services/solicitation.service';
import { SessionQuery } from '@store/session.query';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-cards-solicitation',
  templateUrl: './cards-solicitation.component.html',
  styleUrl: './cards-solicitation.component.scss',
})
export class CardsSolicitationComponent {
  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onOpenSolicitationDetails: EventEmitter<Solicitation> =
    new EventEmitter<Solicitation>();

  @Output()
  onOpenSolicitationChat: EventEmitter<Solicitation> =
    new EventEmitter<Solicitation>();

  protected statusMapping = {
    [SolicitationStatusEnum.Awaiting]: '#007bff',
    [SolicitationStatusEnum.Completed]: '#ffc107',
    [SolicitationStatusEnum.UnderAnalysis]: '#f76e00',
    [SolicitationStatusEnum.PaymentProvisioned]: '#abff00',
    [SolicitationStatusEnum.Received]: '#28a745',
  };

  public solicitations: Solicitation[] = [];

  public user_id;

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
    private readonly _solicitationService: SolicitationService,
    private readonly _sessionQuery: SessionQuery,
  ) {}

  ngOnInit(){
    this._sessionQuery.user$.subscribe((user) => {
      this.user_id = user?.id;
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

    this._solicitationService
      .getList(this.pageControl, this.filters)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          this.solicitations = res.data;

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

  protected getUnreadMessageCount(item: Solicitation): number {
      if (!item.messages?.length) return 0;
  
      const currentUserId = this.user_id;
      const reversedMessages = [...item.messages].reverse();
  
      let count = 0;
  
      for (const message of reversedMessages) {
        if (message.user_id === currentUserId) break;
        count++;
      }
  
      return count;
  }
}
