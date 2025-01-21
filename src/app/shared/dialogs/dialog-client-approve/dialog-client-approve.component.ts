import {
  Component,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from '@models/client';
import { ClientService } from '@services/client.service';
import { Utils } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-client-approve',
  templateUrl: './dialog-client-approve.component.html',
  styleUrl: './dialog-client-approve.component.scss'
})
export class DialogClientApproveComponent {
  // Utils
  public utils = Utils;
  public loading: boolean = false;

  // Form
  public form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data: { client: Client },
    private readonly _dialogRef: MatDialogRef<DialogClientApproveComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      client_id: [this._data.client.id],
    });
  }

  public onSubmit(): void {
    if (!this.form.valid || this.loading) {
      this._toastr.error('Formulário inválido.');
      return;
    }

    this.post();
  }

  protected post() {
    // this._initOrStopLoading();
  }

  protected prepareFormData(form: FormGroup) {
    const formData = new FormData();

    Object.entries(form.controls).forEach(([key, control]) => {
      formData.append(key, control.value);
    });

    return formData;
  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public onCancel(): void {
    this._dialogRef.close();
  }
}
