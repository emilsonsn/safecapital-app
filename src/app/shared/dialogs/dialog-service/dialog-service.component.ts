import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Service } from '@models/service';
import { ServiceService } from '@services/service.service';
import { DialogTypeServiceComponent } from '../dialog-type-service/dialog-type-service.component';

@Component({
  selector: 'app-dialog-service',
  templateUrl: './dialog-service.component.html',
  styleUrl: './dialog-service.component.scss'
})
export class DialogServiceComponent {

  public isNewService: boolean = true;
  public title: string = 'Novo serviço';

  public form: FormGroup;

  public loading : boolean = false;

  public servicesTypeEnum;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: {service: Service},
    private readonly _dialogRef: MatDialogRef<DialogServiceComponent>,
    private readonly _fb: FormBuilder,
    private readonly _dialog: MatDialog,
    private readonly _serviceService : ServiceService
  ) { }

  ngOnInit(): void {

  this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      service_type_id: [null, [Validators.required]],
    })

    if (this._data?.service) {
      this.isNewService = false;
      this.title = 'Editar serviço';
      this._fillForm(this._data.service);
    }

    this.updateTypeServices();
  }

  public openDialogTypeService() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogTypeServiceComponent,
      {
        ...dialogConfig
      })
      .afterClosed()
      .subscribe( (res) => {
        if(!res) {
          this.updateTypeServices();
        }
      })
  }

  // Utils
  public updateTypeServices() {
    this._serviceService.getTypeServices()
      .subscribe(res => {
        this.servicesTypeEnum = res.data;;
      })
  }

  private _fillForm(service: Service): void {

    this.form.patchValue(service);
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public onSubmit(form: FormGroup): void {
    if(!form.valid){
      form.markAllAsTouched();
    }else{
      this._dialogRef.close(form.getRawValue())
    }
  }

}
