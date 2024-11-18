import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {afterNextRender, Component, inject, Inject, Injector, signal, ViewChild} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {ApiResponse, PaymentForm} from '@models/application';
import { Construction } from '@models/construction';
import { Supplier, SupplierType } from '@models/supplier';
import {Banco, OrderResponsible, RequestOrder, RequestOrderStatus, RequestOrderType} from '@models/requestOrder';
import { User } from '@models/user';
import { ConstructionService } from '@services/construction.service';
import { OrderService } from '@services/order.service';
import { SupplierService } from '@services/supplier.service';
import { UserService } from '@services/user.service';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { dateValidator } from '@shared/validators/date';
import { DialogOrderSolicitationComponent } from '../dialog-order-solicitation/dialog-order-solicitation.component';
import { RequestService } from '@services/request.service';
import { RequestStatus } from '@models/request';
import { SessionQuery } from '@store/session.query';

@Component({
  selector: 'app-dialog-order',
  templateUrl: './dialog-order.component.html',
  styleUrl: './dialog-order.component.scss'
})
export class DialogOrderComponent {

  public loading : boolean = false;
  public title : string = 'Novo Pedido';
  protected isNewOrder : boolean = true;
  protected isToEdit : boolean = false;

  protected form : FormGroup;

  protected selectedFiles: File[] = [];
  protected filesToSend : {
    id: number,
    preview: string,
    file: File,
  }[] = [];

  protected filesToRemove : number[] = [];
  protected filesFromBack : {
    index : number,
    id: number,
    name : string,
    path: string, // Wasabi
  }[] = [];

  // Getters
  protected requestTypeSelection = Object.values(RequestOrderType);
  protected requestStatusSelection = Object.values(RequestOrderStatus);
  protected requestOrderPaymentSelection = Object.values(PaymentForm);
  protected requestResponsibleSelection = Object.values(OrderResponsible);

  protected constructions : Construction[] = [];
  protected users : User[] = [];
  protected suppliers : Supplier[] = [];
  protected typeSuppliers : SupplierType[] = [];

  public allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

  public bancos = signal<Banco[]>([]);
  public categories = signal<any[]>([]);

  public isAdmin = false; 
  public hasGranatum = false; 
  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogOrderComponent>,
    private readonly _fb : FormBuilder,
    private readonly _toastr : ToastrService,
    private readonly _orderService : OrderService,
    private readonly _solicitationService : RequestService,
    private readonly _constructionService : ConstructionService,
    private readonly _userService : UserService,
    private readonly _supplierService : SupplierService,
    private readonly _sessionQuery : SessionQuery,
    private readonly _dialog: MatDialog,
  ) {

    this._orderService.getBank().subscribe((b: ApiResponse<Banco[]>) => {
      this.bancos.set(b.data);
    })

    this._orderService.getCategories().subscribe((b: ApiResponse<any[]>) => {
      this.categories.set(b.data);
    })
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      order_type: [null, Validators.required],
      date: [null, Validators.required],
      construction_id: [null, Validators.required],
      user_id: [null, Validators.required],
      supplier_id: [null, Validators.required],
      description: [''],
      total_value: [null, Validators.required],
      payment_method: [null, Validators.required],
      purchase_status: [null],
      quantity_items: [null, Validators.required],
      items: this._fb.array([]),
      bank_id: [null],
      category_id: [null],

      // responsible: [null],  Não implementado no back
    });

    this.getConstructions();
    this.getSuppliers();
    this.getUsers();
    this.loadPermissions();
    this.loadPermissionGranatum();

    if (this._data) {
      this.isNewOrder = false;
      this.title = 'Editar Pedido';

      if (this._data.order.items) {
        this._data.order.items.forEach(item => {
          this.items.push(this.createItemFromData(item));
        });
      }

      if(!this._data.edit) {
        this.isToEdit = true;
        this.form.disable();

        (this.items as FormArray).controls.forEach((item: AbstractControl) => {
          item.disable();
        });
      }

      this._data.order.files.forEach((file, index) => {
        this.filesFromBack.push({
          index : index,
          id: file.id,
          name: file.name,
          path: file.path
        });
      });

      this.form.patchValue(this._data.order);
    } else {
        this.items.push(this.createItem());
    }

    // Autoupdate total_value e quantity_items
    this.form.get('items').valueChanges.subscribe((items) => {
      if(!items[items.length - 1]?.unit_value && !items[items.length - 1]?.quantity) return

      this.form.get('quantity_items').setValue(0);
      this.form.get('total_value').setValue(0);

      let newTotal = 0;
      let newValue = 0;

      items.forEach(item => {
        newValue += (+item?.unit_value * +item?.quantity);
        newTotal += (+item?.quantity);
      });

      this.form.get('quantity_items').setValue(+newTotal.toFixed(2));
      this.form.get('total_value').setValue(+newValue.toFixed(2));
    });

  }

  public loadPermissions(){
    this._sessionQuery.user$.subscribe(user => {
      if(user && user?.company_position.position !== 'Requester') {
        this.isAdmin = true;
      }else{
        this.form.get('purchase_status').disable();        
      }
    })
  }

  public loadPermissionGranatum(){
    this._sessionQuery.user$.subscribe(user => {
      if(user && (user?.company_position.position === 'Financial' || user?.company_position.position === 'Admin')) {
        this.hasGranatum = true;
      }
    })
  }

  public postOrder(order : RequestOrder) {
    if (!this.prepareFormData(order)){
      this.loading = false;
      return;
    }

    this._orderService.postOrder(this.prepareFormData(order))
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
      .subscribe({
        next: (res) => {
          this._toastr.success('Pedido enviado com sucesso!');
          this._dialogRef.close(true);
        },
        error : (err) => {
          this._toastr.error(err.error.error);
        }
      });
  }

  public patchOrder(id : number, order : RequestOrder) {
    if (!this.prepareFormData(order)){
      this.loading = false;
      return;
    }

    this._orderService.patchOrder(id, this.prepareFormData(order))
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
      .subscribe({
        next: (res) => {
          this._toastr.success('Pedido atualizado com sucesso!');
          this._dialogRef.close(true);
        },
        error : (err) => {
          this._toastr.error(err.error.error);
        }
      });
  }

  public prepareFormData(order : RequestOrder) {
    if(!order.items.length ){
      this._toastr.error('Item é um campo obrigatório');
      return;
    }

    if(!order.order_files.length && !this.filesFromBack.length){
      this._toastr.error('Anexo é um campo obrigatório');
      return;
    }

    const orderFormData = new FormData();

    Object.keys(order).forEach((key) => {

      if(key == 'order_files') {
        (order.order_files).forEach(file => {
          orderFormData.append('order_files[]', file);
        });
      }
      else if(key == 'date') {
        orderFormData.append('date', dayjs(order.date).format('YYYY-MM-DD'));
      }
      else if(key == 'items') {
        (order.items).forEach(item => {
          orderFormData.append('items[]', JSON.stringify(item));
        });
      }
      else
        orderFormData.append(key, order[key]);
    });

    return orderFormData;
  }

  public onSolicitation(){
    const order: RequestOrder = this._data.order
    const data = {
      order_id: order.id,
      total_value: order.total_value,
      supplier_id: order.supplier_id,
      construction_id: order.construction_id,
      status: RequestStatus.Pending,
      user_id: order.user_id,
    }

    this._dialog
      .open(DialogOrderSolicitationComponent, {
        data,
        width: '80%',
        maxWidth: '850px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.createSolicitation(res)
        }
      });
  }

  private createSolicitation(data){
    this._solicitationService.postRequest(data)
    .subscribe({
      next: () => {
        this._toastr.success('Pedido solicitado com sucesso!');
        this._dialogRef.close();
      },
      error: (err) => {
        this._toastr.error(err.error.error);
      },
    });
  }

  public onConfirm(): void {
    if(!this.form.valid || this.loading) return;

    this._initOrStopLoading();

    let order_files : File[] = [];

    for(let file of this.filesToSend) {
      order_files.push(file.file);
    }

    if(this.isNewOrder) {
      this.postOrder(
        {
          order_files,
          ...this.form.getRawValue()
        }
      );
    }
    else {
      this.filesToRemove.forEach(file => {
        this._orderService.deleteFile(file)
          .subscribe({
            next : (res) => {

            },
            error : (err) => {
              this._toastr.error(err.error.error);
            }
          })
        })

      this.patchOrder(
        this._data.order.id,
        {
          order_files,
          ...this.form.getRawValue()
        }
      );
    }

  }

  public onCancel(): void {
    this._dialogRef.close(false);
  }

  // Items
  public createItem(): FormGroup {
    return this._fb.group({
      id : [null],
      name: [null, Validators.required],
      unit_value: [null, Validators.required],
      quantity: [null, Validators.required]
    });
  }

  private createItemFromData(item: any): FormGroup {
    return this._fb.group({
      id: [item.id],
      name: [{ value: item.key}, [Validators.required]],
      unit_value: [item.unit_value, [Validators.required]],
      quantity: [item.type, [Validators.required]],
    });
  }

  public pushItem(): void {
    this.items.push(this.createItem());
  }

  public onDeleteItem(index: number): void {
    if (!this.items.value[index].id) {
      this.items.removeAt(index);

      if (this.items.length === 0) {
        this.items.push(this.createItem());
      }
      return;
    }

    this.deleteItem(index)

    if (this.items.length === 0) {
      this.items.push(this.createItem());
    }
  }

  private deleteItem(index){
    this._orderService.deleteItem(this.items.value[index].id)
    .subscribe({
      next: () => {
        this._toastr.success("Item deletado com sucesso");
        this.items.removeAt(index);
      },
      error: (err) => {
        this._toastr.error(err.error.error);
      }
    })
  }

  // Files
  public async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  public async onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const fileArray: File[] = Array.from(files);

    for (const file of fileArray) {
      if (this.allowedTypes.includes(file.type)) {
        let base64 : string = null;

        if (file.type.startsWith('image/')) {
          base64 = await this.convertFileToBase64(file);
        }

        this.filesToSend.push({
          id: this.filesToSend.length + 1,
          preview: base64,
          file: file,
        });
      }
      else
        this._toastr.error(`${file.type} não é permitido`);
    }
  }

  public removeFileFromSendToFiles(index: number) {
    if (index > -1) {
      this.filesToSend.splice(index, 1);
    }
  }

  public prepareFileToRemoveFromBack(fileId, index) {
    this.filesFromBack.splice(index, 1);
    this.filesToRemove.push(fileId);
  }

  public openImgInAnotherTab(url: string) {
    window.open(url, '_blank');
  }

  // Para pedidos existentes
  public throwToGranatum() {
    this._initOrStopLoading();

    this._orderService.throwToGranatum(this._data.order.id)
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error : (err) => {
          this._toastr.error(err.error.error);
        }
      })
  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public resetGatewaySelection() {
    this.order_type.reset();
  }

  public resetResponsibleSelection() {
    this.responsible.reset();
  }

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

  // Getters
  public get order_type() {
    return this.form.get('order_type') as FormControl;
  }

  public get payment_method() {
    return this.form.get('payment_method') as FormControl;
  }

  public get purchase_status() {
    return this.form.get('purchase_status') as FormControl;
  }


  public get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  public get responsible() {
    return this.form.get('responsible') as FormControl;
  }

  // Imports
  // TextArea
  private _injector = inject(Injector);

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for content to render, then trigger textarea resize.
    afterNextRender(
      () => {
        this.autosize.resizeToFitContent(true);
      },
      {
        injector: this._injector,
      },
    );
  }

}
