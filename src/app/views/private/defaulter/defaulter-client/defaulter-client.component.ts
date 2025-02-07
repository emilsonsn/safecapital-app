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
import { Solicitation } from '@models/solicitation';
import { DialogSolicitationComponent } from '@shared/dialogs/dialog-solicitation/dialog-solicitation.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-defaulter-client',
  templateUrl: './defaulter-client.component.html',
  styleUrl: './defaulter-client.component.scss'
})
export class DefaulterClientComponent {
  public filters;
  public loading: boolean = false;
  public formFilters: FormGroup;
  protected role: UserRole;
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

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _router: Router,
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _requestService: RequestService,
    private readonly _toastrService: ToastrService,
    private readonly _sessionQuery: SessionQuery,
    private cdr: ChangeDetectorRef,
    private readonly _matBottomSheet : MatBottomSheet,
  ) {
    this._headerService.setTitle('Inadimplência');
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
      search_term: [''],
      category: ['Default']
    });
  }

  public openSolicitationDialog(solicitation? : Solicitation) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '725px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogSolicitationComponent, {
        data: { solicitation : solicitation ?? null, default : true, hasFiles: true },
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

  public deleteDialog(request : Solicitation) {
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
          if(res) {
            console.log("Deleta o chamado")
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
      category: 'Default'
    });

    this.updateFilters();
  }

  protected handleSearchTerm(res) {
    this.searchTerm = res;
  }
}
