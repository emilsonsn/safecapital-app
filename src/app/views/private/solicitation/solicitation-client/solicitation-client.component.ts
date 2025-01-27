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
import { RequestService } from '@services/request.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { SessionQuery } from '@store/session.query';
import { UserRole } from '@models/user';
import { Solicitation, SolicitationCategoryEnum } from '@models/solicitation';
import { DialogSolicitationComponent } from '@shared/dialogs/dialog-solicitation/dialog-solicitation.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SolicitationChatComponent } from '../solicitation-chat/solicitation-chat.component';
import { debounceTime, map, ReplaySubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-solicitation-client',
  templateUrl: './solicitation-client.component.html',
  styleUrl: './solicitation-client.component.scss',
})
export class SolicitationClientComponent {
  // Utils
  protected _onDestroy = new Subject<void>();
  protected role: UserRole;
  public loading: boolean = false;

  // Form
  public filters;
  public formFilters: FormGroup;
  protected searchTerm: string = '';

  // Cards
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

  // Filters
  protected SolicitationCategoryEnumSelect = Object.values(
    SolicitationCategoryEnum
  ).filter((value) => value !== SolicitationCategoryEnum.Default);

  protected categorySelect = Object.values(this.SolicitationCategoryEnumSelect);
  protected categoryCtrl: FormControl<any> = new FormControl<any>(null);
  protected categoryFilterCtrl: FormControl<any> = new FormControl<string>('');
  protected filteredCategories: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _router: Router,
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _requestService: RequestService,
    private readonly _toastrService: ToastrService,
    private readonly _sessionQuery: SessionQuery,
    private cdr: ChangeDetectorRef,
    private readonly _matBottomSheet: MatBottomSheet
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
    this.formFilters = this._fb.group({
      user_id: [''],
      category: [this.SolicitationCategoryEnumSelect],
    });

    this.prepareFilterCategoryCtrl();
    this.updateFilters();
  }

  public openRequestDialog(solicitation?: Solicitation) {
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

  public openRequestChat(solicitation: Solicitation): void {
    this._matBottomSheet.open(SolicitationChatComponent, {
      data: { solicitation },
      disableClose: true,
      hasBackdrop: false,
    });
  }

  public deleteDialog(request: Solicitation) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogConfirmComponent, {
        data: { text: `Tem certeza? Essa ação não pode ser revertida!` },
        ...dialogConfig,
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            console.log('Deleta o chamado');
          }
        },
      });
  }

  // Filters
  public updateFilters() {
    this.filters = this.formFilters.getRawValue();
  }

  public clearFormFilters() {
    this.formFilters.patchValue({
      search_term: '',
      category: this.SolicitationCategoryEnumSelect,
    });
    this.updateFilters();
  }

  protected handleSearchTerm(res) {
    this.searchTerm = res;
  }

  protected prepareFilterCategoryCtrl() {
    this.filteredCategories.next(this.categorySelect.slice());

    this.categoryFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.categorySelect.slice();
          } else {
            search = search.toLowerCase();
            return this.categorySelect.filter((category) =>
              category.toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredCategories.next(filtered);
      });
  }
}
