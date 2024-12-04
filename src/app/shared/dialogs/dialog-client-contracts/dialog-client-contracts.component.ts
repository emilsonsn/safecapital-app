import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { afterNextRender, Component, inject, Inject, Injector, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from '@models/client';
import { Solicitation, SolicitationStatusEnum } from '@models/solicitation';
import { SolicitationService } from '@services/solicitation.service';
import { UtilsService } from '@services/utils.service';
import { Utils } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-client-contracts',
  templateUrl: './dialog-client-contracts.component.html',
  styleUrl: './dialog-client-contracts.component.scss'
})
export class DialogClientContractsComponent {

  // Utils
  public utils = Utils;
  public loading: boolean = false;

  // Form
  public form: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data : { client : Client },
    private readonly _dialogRef: MatDialogRef<DialogClientContractsComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
  ) {}

  ngOnInit(): void {

  }

  public onSubmit(): void {

  }

  protected post() {
    this._initOrStopLoading();


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
