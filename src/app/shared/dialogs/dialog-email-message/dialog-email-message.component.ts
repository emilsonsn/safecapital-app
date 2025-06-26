import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-email-message',
  templateUrl: './dialog-email-message.component.html',
  styleUrls: ['./dialog-email-message.component.scss']
})
export class DialogMailMessageComponent implements OnInit {
 public form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly data: { client_id?: number, contract_number?: string },
    private readonly dialogRef: MatDialogRef<DialogMailMessageComponent>,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      client_id: [this.data.client_id],
      contract_number: [this.data.contract_number],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onConfirm(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    }
  }
}