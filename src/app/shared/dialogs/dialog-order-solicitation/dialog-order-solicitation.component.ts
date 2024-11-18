import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestType } from '@models/request';

@Component({
  selector: 'app-dialog-order-solicitation',
  templateUrl: './dialog-order-solicitation.component.html',
  styleUrl: './dialog-order-solicitation.component.scss'
})
export class DialogOrderSolicitationComponent {

  public loading: boolean = false;
  public form: FormGroup;
  protected requestTypeSelection = Object.values(RequestType);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data,
    private readonly _fb: FormBuilder,
    private readonly _dialogRef: MatDialogRef<DialogOrderSolicitationComponent>
  ){}

  ngOnInit() {
    this.form = this._fb.group({
      solicitation_type: [null, Validators.required], // colocar      
    });
  }

  public onConfirm(){
    if(!this.form.valid) return;
    this._dialogRef.close({
      ...this._data,
      solicitation_type: this.form.get('solicitation_type').value
    })
  }

  public onCancel(){
    this._dialogRef.close()
  }
}
