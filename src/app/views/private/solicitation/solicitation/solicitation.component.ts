import {
  ChangeDetectorRef,
  Component,
  computed,
  Signal,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ISmallInformationCard, requestCards } from '@models/cardInformation';
import { HeaderService } from '@services/header.service';
import { RequestService } from '@services/request.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { SessionQuery } from '@store/session.query';
import { UserRole } from '@models/user';
import { Kanban } from '@models/Kanban';
import { Solicitation, SolicitationStatusEnum } from '@models/solicitation';
import { KanbanSolicitationStatus } from '@shared/components/kanban/kanban.component';
import { DialogSolicitationComponent } from '@shared/dialogs/dialog-solicitation/dialog-solicitation.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SolicitationChatComponent } from '../solicitation-chat/solicitation-chat.component';
import { SolicitationService } from '@services/solicitation.service';
import { Order, PageControl } from '@models/application';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-solicitation',
  templateUrl: './solicitation.component.html',
  styleUrl: './solicitation.component.scss',
})
export class SolicitationComponent {
  protected cards = signal<requestCards>({
    solicitationFinished: 0,
    solicitationPending: 0,
    solicitationReject: 0,
  });
  public filters;
  public loading: boolean = false;
  public formFilters: FormGroup;
  protected role: UserRole;
  protected searchTerm: string = '';

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
  }

  ngOnInit() {
    // Inicia as colunas do kanban
    this.status.forEach((status) => {
      this.kanbanData[status.name] = [];
    });

    this.getSolicitationData();
  }

  // Kanban
  protected solicitationData: Solicitation[] = [];

  protected kanbanData: Kanban<Solicitation> = {};

  protected status: KanbanSolicitationStatus[] = [
    {
      id: 1,
      slug: SolicitationStatusEnum.Open,
      name: 'Aberto',
      color: '#FFFFFF',
    },
    {
      id: 2,
      slug: SolicitationStatusEnum.Closed,
      name: 'Fechado',
      color: '#FF00FF',
    },
  ];

  protected getSolicitationData() {
    this._initOrStopLoading();

    this._solicitationService
      .getList(this.pageControl, this.filters)
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
      maxWidth: '1000px',
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
    this._matBottomSheet.open(SolicitationChatComponent, {
      data: { solicitation },
      disableClose: true,
      hasBackdrop: false,
    });
  }

  protected taskMoved(solicitation: Solicitation) {
    this._initOrStopLoading();

    this._solicitationService.patch(solicitation.id, solicitation)
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
      .subscribe({
        next: (res) => {
          // O kanban atualiza visualmente, sem necessidade de fazer search
        },
        error: (err) => {
          this._toastrService.error(err.error.error);
        },
      })
  }

  // Filters
  public updateFilters() {
    this.filters = this.formFilters.getRawValue();
  }

  public clearFormFilters() {
    this.formFilters.patchValue({
      search_term: '',
    });
    this.updateFilters();
  }

  protected handleSearchTerm(res) {
    this.searchTerm = res;
  }

  // Utils
  protected _initOrStopLoading() {
    this.loading = !this.loading;
  }
}
