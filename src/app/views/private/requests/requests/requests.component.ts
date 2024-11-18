import {Component, computed, Signal, signal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ISmallInformationCard} from '@models/cardInformation';
import {HeaderService} from '@services/header.service';
import {RequestService} from '@services/request.service';
import {DialogConfirmComponent} from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import {DialogRequestComponent} from '@shared/dialogs/dialog-request/dialog-request.component';
import {
  DialogFilterRequestComponent
} from '@shared/dialogs/filters/dialog-filter-request/dialog-filter-request.component';
import dayjs from 'dayjs';
import {requestCards} from "@models/requestOrder";
import { ToastrService } from 'ngx-toastr';
import { DialogOrderComponent } from '@shared/dialogs/dialog-order/dialog-order.component';
import { OrderService } from '@services/order.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss'
})
export class RequestsComponent {

  cards = signal<requestCards>(
    {
      solicitationFinished: 0,
      solicitationPending: 0,
      solicitationReject: 0
    }
  )
  public filtersFromDialog: FormGroup;
  public filters;
  public loading: boolean = false;

  itemsRequests: Signal<ISmallInformationCard[]> = computed<ISmallInformationCard[]>(() => [
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
    private readonly _orderService: OrderService,
    private readonly _toastrService: ToastrService
  ) {
    this._headerService.setTitle('Solicitações');
    this._headerService.setSubTitle('');

    _requestService.getCards().subscribe({
      next: (res) => {
        this.cards.set(res.data);
      }
    })
  }

  ngOnInit() {
    this.filtersFromDialog = this._fb.group({
      start_date: [''],
      end_date: [''],
      status: new FormControl([]),
      name: [''],
    });
  }

  public openRequestDialog(request?) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogRequestComponent, {
        data: request ? {...request} : null,
        ...dialogConfig
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
        }
      })
  }

  public openOrderFilterDialog() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogFilterRequestComponent, {
        data: {...this.filtersFromDialog.getRawValue()},
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this.filters = {
              ...res.filters,
              start_date: res.filters?.start_date ? dayjs(res.filters.start_date).format('YYYY-MM-DD') : '',
              end_date: res.filters?.end_date ? dayjs(res.filters.end_date).format('YYYY-MM-DD') : '',
            };

            !res.clear ? this.filtersFromDialog.patchValue(res.filters) : this.filtersFromDialog.reset();
          }
        }
      })
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
        data: {text: `Tem certeza? Essa ação não pode ser revertida!`},
        ...dialogConfig
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
                    this.itemsRequests().filter((item) => item.title!== request.title);
                  }, 200);
                }
              });
            }
          }
        }
      )
  }

  onOrderModal(request){
    this._orderService.getOrderById(request.order_id).subscribe(order => {
        const dialogConfig: MatDialogConfig = {
          width: '80%',
          maxWidth: '850px',
          maxHeight: '90%',
          hasBackdrop: true,
          closeOnNavigation: true,
        };

        this._dialog
          .open(DialogOrderComponent, {
            data: {order: order, edit: true},
            ...dialogConfig
          });
    });

  }

}
