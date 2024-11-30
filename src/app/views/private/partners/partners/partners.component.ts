import { Component, computed, Signal, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ISmallInformationCard, requestCards } from '@models/cardInformation';
import { HeaderService } from '@services/header.service';
import { RequestService } from '@services/request.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { DialogCollaboratorComponent } from '@shared/dialogs/dialog-collaborator/dialog-collaborator.component';
import { DialogPartnerAnalysisComponent } from '@shared/dialogs/dialog-partner-analysis/dialog-partner-analysis.component';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss',
})
export class PartnersComponent {
  public formFilters: FormGroup;
  protected cards = signal<requestCards>({
    solicitationFinished: 0,
    solicitationPending: 0,
    solicitationReject: 0,
  });
  public filters;
  public loading: boolean = false;

  itemsRequests: Signal<ISmallInformationCard[]> = computed<
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
    private readonly _toastrService: ToastrService
  ) {
    this._headerService.setTitle('Parceiros');
    this._headerService.setSubTitle('');

    // _requestService.getCards().subscribe({
    //   next: (res) => {
    //     this.cards.set(res.data);
    //   }
    // })
  }

  ngOnInit() {
    this.formFilters = this._fb.group({
      search_term : ''
    });
  }

  public openPartnerDialog(user?) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogCollaboratorComponent, {
        data: {
          isClient: true,
          user,
        },
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

  public openRequestDialog(request) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogPartnerAnalysisComponent, {
        data: request ? { ...request } : null,
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

  public deleteDialog(request) {
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
            this._requestService.deleteRequest(request.id).subscribe({
              next: (resData) => {
                this.loading = true;
                this._toastrService.success(resData.message);
                setTimeout(() => {
                  this.loading = false;
                  this.itemsRequests().filter(
                    (item) => item.title !== request.title
                  );
                }, 200);
              },
            });
          }
        },
      });
  }

  handleSearchTerm(res) {

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
}
