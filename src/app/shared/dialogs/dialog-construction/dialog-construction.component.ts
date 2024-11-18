import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Construction } from '@models/construction';
import { ClientService } from '@services/client.service';

@Component({
  selector: 'app-dialog-construction',
  templateUrl: './dialog-construction.component.html',
  styleUrl: './dialog-construction.component.scss'
})
export class DialogConstructionComponent {

  public isNewConstruction: boolean = true;
  public title: string = 'Nova contrução';

  public clients;

  public form: FormGroup;

  public loading : boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: {construction: Construction},
    private readonly _dialogRef: MatDialogRef<DialogConstructionComponent>,
    private readonly _fb: FormBuilder,
    private readonly _clientService: ClientService
  ) { }

  ngOnInit(): void {

  this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      local: [null, [Validators.required]],
      contractor_id: [null, [Validators.required]],
      client_id: [null, [Validators.required]],
      cno: [null, [Validators.required]],
      description: [null, [Validators.required]],
    })

    if (this._data?.construction) {
      this.isNewConstruction = false;
      this.title = 'Editar obra';
      this._fillForm(this._data.construction);
    }

    this.searchClients();
  }

  private _fillForm(construction: Construction): void {

    this.form.patchValue(construction);
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

  public searchClients() {
    this._clientService.getClients()
      .subscribe(res => {
        this.clients = res.data;;
      })
  }

}

