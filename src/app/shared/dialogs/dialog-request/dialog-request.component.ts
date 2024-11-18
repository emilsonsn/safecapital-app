import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order } from '@models/application';
import { Construction } from '@models/construction';
import { Request, RequestStatus, RequestType } from '@models/request';
import { RequestOrder, RequestOrderStatus } from '@models/requestOrder';
import { Supplier } from '@models/supplier';
import { User } from '@models/user';
import { ConstructionService } from '@services/construction.service';
import { OrderService } from '@services/order.service';
import { RequestService } from '@services/request.service';
import { SupplierService } from '@services/supplier.service';
import { UserService } from '@services/user.service';
import { SessionQuery } from '@store/session.query';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-request',
  templateUrl: './dialog-request.component.html',
  styleUrl: './dialog-request.component.scss'
})
export class DialogRequestComponent {

  public form : FormGroup;
  public loading : boolean = false;
  public title : string = 'Nova Solicitação';
  public isNewRequest : boolean = true;
  public isToEdit : boolean = false;

  // Getters
  protected requestStatusSelection = Object.values(RequestStatus);
  protected requestTypeSelection = Object.values(RequestType);

  protected constructions : Construction[] = [];
  protected users : User[] = [];
  protected suppliers : Supplier[] = [];
  protected orders : RequestOrder[] = [];
  public isAdmin: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogRequestComponent>,
    private readonly _fb : FormBuilder,
    private readonly _toastr : ToastrService,
    private readonly _requestService : RequestService,
    private readonly _orderService : OrderService,
    private readonly _constructionService : ConstructionService,
    private readonly _userService : UserService,
    private readonly _supplierService : SupplierService,
    private readonly _sessionQuery : SessionQuery,
  ) { }

  ngOnInit() {
    this.form = this._fb.group({
      order_id : [null, Validators.required],
      solicitation_type: [null, Validators.required],
      total_value: [null, Validators.required],
      supplier_id: [null, Validators.required],
      user_id: [null, Validators.required],
      construction_id: [null, Validators.required],
      status: [null],
      payment_date: [null],
    });

    this.getConstructions();
    this.getUsers();
    this.getSuppliers();
    this.getOrders();
    this.loadPermissions();

    if (this._data) {
      this.isNewRequest = false;
      this.title = 'Editar Solicitação';

      if(!this._data.edit) {
        this.isToEdit = true;
      }

      this.form.patchValue(this._data);
    }
  }

  public loadPermissions(){
    this._sessionQuery.user$.subscribe(user => {
      if(user && user?.company_position.position !== 'Requester') {
        this.isAdmin = true;
      }
    })
  }

  public postRequest(request : Request) {

    this._requestService.postRequest(request)
     .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
     .subscribe({
        next: (res) => {
          this._toastr.success('Solicitação cadastrada com sucesso!');
          this._dialogRef.close(true);
        },
        error: (error) => {
          this._toastr.error('Ocorreu um erro ao cadastrar a solicitação.');
        }
      });

  }

  public patchRequest(request_id : number, request : Request) {

    this._requestService.patchRequest(request_id, request)
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
     .subscribe({
        next: (res) => {
          this._toastr.success('Solicitação atualizada com sucesso!');
          this._dialogRef.close(true);
        },
        error: (error) => {
          this._toastr.error('Ocorreu um erro ao cadastrar a solicitação.');
        }
      });
  }


  public onConfirm(): void {
    if(!this.form.valid) return;

    this._initOrStopLoading();

    if(this.isNewRequest) {
      this.postRequest(
        {
          ...this.form.getRawValue()
        }
      );
    }
    else {
      this.patchRequest(
        this._data?.id,
        {
          ...this.form.getRawValue()
        }
      );
    }

  }

  public onCancel(): void {
    this._dialogRef.close(false);
  }

  // Utils

  public prepareFormData(request : Request) {
    const orderFormData = new FormData();

    Object.keys(request).forEach((key) => {
      orderFormData.append(key, request[key]);
    });

    return orderFormData;
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  // Getters
  public getConstructions() {
    this._constructionService.getConstructions()
      .subscribe(res => {
        this.constructions = res.data;
      })
  }

  public getUsers() {
    this._userService.getUsers()
      .subscribe(res => {
        this.users = res.data;
      })
  }

  public getSuppliers() {
    this._supplierService.getSuppliers()
      .subscribe(res => {
        this.suppliers = res.data;
      })
  }

  public getOrders() {
    this._orderService.getOrders()
      .subscribe(res => {
        this.orders = res.data;
      })
  }

}
