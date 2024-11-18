import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestOrderStatus } from '@models/requestOrder';

@Component({
  selector: 'app-dialog-filter-request',
  templateUrl: './dialog-filter-request.component.html',
  styleUrl: './dialog-filter-request.component.scss'
})
export class DialogFilterRequestComponent {

  protected form : FormGroup;

  protected filterStatus: string[] = Object.values(RequestOrderStatus);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data,
    private readonly dialogRef: MatDialogRef<DialogFilterRequestComponent>,
    private readonly _fb : FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      start_date: [''],
      end_date: [''],
      status: new FormControl([]),
      name: [''],
    });

    if(this._data) {
      this.form.patchValue(this._data);
    }
  }

  public onConfirm(): void {
    if(!this.form.valid) return;

    this.dialogRef.close({
      clear : false,
      filters : {
        ...this.form.getRawValue(),
      }
    });
  }

  public onCancel(clear? : boolean): void {
    if(clear)
      this.dialogRef.close({ 'clear' : true });
    else
      this.dialogRef.close();
  }

  // Utils
  public resetStatusSelection() {
    this.status.reset();
  }

  // Getters
  public get status() {
    return this.form.get('status') as FormControl;
  }

}
