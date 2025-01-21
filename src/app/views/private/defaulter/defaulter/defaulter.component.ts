import {
  ChangeDetectorRef,
  Component,
  computed,
  Signal,
  signal,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ISmallInformationCard, requestCards } from '@models/cardInformation';
import { HeaderService } from '@services/header.service';
import { ToastrService } from 'ngx-toastr';
import { SessionQuery } from '@store/session.query';
import { User, UserRole } from '@models/user';
import { Kanban } from '@models/Kanban';
import { Solicitation, SolicitationStatusEnum } from '@models/solicitation';
import { KanbanSolicitationStatus } from '@shared/components/kanban/kanban.component';
import { DialogSolicitationComponent } from '@shared/dialogs/dialog-solicitation/dialog-solicitation.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SolicitationService } from '@services/solicitation.service';
import { Order, PageControl } from '@models/application';
import {
  debounceTime,
  finalize,
  map,
  ReplaySubject,
  Subject,
  takeUntil,
} from 'rxjs';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-defaulter',
  templateUrl: './defaulter.component.html',
  styleUrl: './defaulter.component.scss',
})
export class DefaulterComponent {
  protected _onDestroy = new Subject<void>();
  public filters;
  public loading: boolean = false;
  public formFilters: FormGroup;
  protected role: UserRole;
  protected searchTerm: string = '';

  protected cards = signal<requestCards>({
    solicitationFinished: 0,
    solicitationPending: 0,
    solicitationReject: 0,
  });
  protected itemsRequests: Signal<ISmallInformationCard[]> = computed<
    ISmallInformationCard[]
  >(() => [
    {
      icon: 'fa-solid fa-envelope-open',
      // icon_description: 'fa-solid fa-calendar-day',
      // background: '#17a2b8',
      title: this.cards().solicitationPending,
      category: 'Solicitações em aberto',
      description: 'Solicitações em aberto',
    },
    {
      icon: 'fa-solid fa-calendar-times',
      // icon_description: 'fa-solid fa-calendar-day',
      background: '#dc3545',
      title: this.cards().solicitationReject,
      category: 'Solicitações vencidas',
      description: 'Solicitações vencidas',
    },
    {
      icon: 'fa-solid fa-check-circle',
      // icon_description: 'fa-solid fa-calendar-day',
      background: '#28a745',
      title: this.cards().solicitationFinished,
      category: 'Solicitações resolvidas',
      description: 'Solicitações resolvidas',
    },
  ]);

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: 'id',
    order: Order.ASC,
  };

  // Filters
  protected userSelect: User[] = [];

  protected partnerCtrl: FormControl<any> = new FormControl<any>(null);
  protected partnerFilterCtrl: FormControl<any> = new FormControl<string>('');
  protected filteredPartners: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _router: Router,
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _solicitationService: SolicitationService,
    private readonly _toastrService: ToastrService,
    private readonly _sessionQuery: SessionQuery,
    private cdr: ChangeDetectorRef,
    private readonly _matBottomSheet: MatBottomSheet,
    private readonly _userService: UserService
  ) {
    this._headerService.setTitle('Chamados');
    this._headerService.setSubTitle('');

    // _requestService.getCards().subscribe({
    //   next: (res) => {
    //     this.cards.set(res.data);
    //   }
    // })
    this._sessionQuery.user$.subscribe((user) => {
      this.role = user?.role;
    });

    this.getUsersFromBack();
  }

  ngOnInit() {
    // Inicia as colunas do kanban
    this.status.forEach((status) => {
      this.kanbanData[status.name] = [];
    });

    this.formFilters = this._fb.group({
      user_id: [''],
    });

    this.getSolicitationData();
  }

  // Kanban
  protected solicitationData: Solicitation[] = [];

  protected kanbanData: Kanban<Solicitation> = {};

  protected status: KanbanSolicitationStatus[] = [
    {
      id: 1,
      slug: SolicitationStatusEnum.Received,
      name: 'Recebido',
      color: '#FFFFFF',
    },
    {
      id: 2,
      slug: SolicitationStatusEnum.UnderAnalysis,
      name: 'Em Análise',
      color: '#FF00FF',
    },
    {
      id: 3,
      slug: SolicitationStatusEnum.Awaiting,
      name: 'Esperando imobiliária',
      color: '#FFFFFF',
    },
    {
      id: 4,
      slug: SolicitationStatusEnum.PaymentProvisioned,
      name: 'Pagamento provisionado',
      color: '#FF00FF',
    },
    {
      id: 5,
      slug: SolicitationStatusEnum.Completed,
      name: 'Finalizado',
      color: '#FF00FF',
    },
  ];

  protected getSolicitationData() {
    this._initOrStopLoading();

    for (const status of this.status) {
      this.kanbanData[status.name] = [];
    }

    this._solicitationService
      .getList(this.pageControl, {
        ...this.filters,
        searchTerm: this.searchTerm,
      })
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this.solicitationData = res.data;

          this.solicitationData.forEach((task) => {
            const name = this.status.find(
              (status) => status.slug == task.status
            )?.name;

            if (name) this.kanbanData[name].push(task);

            this.cdr.detectChanges();
          });
        },
        error: (err) => {
          this._toastrService.error(err.error.error);
        },
      });
  }

  public openSolicitationDialog(solicitation?: Solicitation) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '725px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogSolicitationComponent, {
        data: solicitation ? { solicitation } : null,
        ...dialogConfig,
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
            }, 200);
          }
        },
      });
  }

  protected openSolicitationChat(solicitation: Solicitation): void {
    console.log("não haverá chat para inadimplente");
  }

  protected taskMoved(solicitation: Solicitation) {
    this._initOrStopLoading();

    this._solicitationService
      .patch(solicitation.id, solicitation)
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          // O kanban atualiza visualmente, sem necessidade de fazer search
        },
        error: (err) => {
          this._toastrService.error(err.error.error);
        },
      });
  }

  // Filters
  public updateFilters() {
    this.filters = this.formFilters.getRawValue();

    this.getSolicitationData();
  }

  public clearFormFilters() {
    this.formFilters.patchValue({
      search_term: '',
    });
    this.updateFilters();
  }

  protected handleSearchTerm(res) {
    this.searchTerm = res;

    this.updateFilters();
  }

  protected prepareFilterClientCtrl() {
    this.partnerFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.userSelect
              .filter((user) => user.role.toLowerCase() == 'client')
              .slice();
          } else {
            search = search.toLowerCase();
            return this.userSelect.filter(
              (user) =>
                user.role.toLowerCase() == 'client' &&
                user.name.toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredPartners.next(filtered);
      });
  }

  // Utils
  protected _initOrStopLoading() {
    this.loading = !this.loading;
  }

  // Getters

  public getUsersFromBack() {
    this._userService.getUsers().subscribe((res) => {
      this.userSelect = res.data;

      this.filteredPartners.next(
        this.userSelect
          .filter((user) => user.role.toLowerCase() == 'client')
          .slice()
      );

      this.prepareFilterClientCtrl();
    });
  }
}
