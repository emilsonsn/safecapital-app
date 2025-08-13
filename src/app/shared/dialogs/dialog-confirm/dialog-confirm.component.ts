import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent implements OnInit {

  public text: string = 'Você tem certeza?';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly data: {text: string},
    private readonly dialogRef: MatDialogRef<DialogConfirmComponent>,
  ) { }

  ngOnInit(): void {
    this.text = this.data?.text ?? 'Tem certeza? Essa ação não pode ser revertida!';
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }

}
