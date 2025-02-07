import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Client } from '@models/client';
import { ClientService } from '@services/client.service';
import { Utils } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-dialog-client-contracts',
  templateUrl: './dialog-client-contracts.component.html',
  styleUrl: './dialog-client-contracts.component.scss',
})
export class DialogClientContractsComponent {
  // Utils
  public utils = Utils;
  public loading: boolean = false;
  protected shouldUpdate : boolean = false;

  // Form
  public form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data: { client: Client },
    private readonly _dialog: MatDialog,
    private readonly _dialogRef: MatDialogRef<DialogClientContractsComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      client_id: [this._data.client.id],
    });
  }

  public onSubmit(): void {
    if (!this.form.valid || this.loading) {
      this._toastr.error('Formulário inválido!');
      return;
    }

    if((!this.filesToSend || this.filesToSend.length == 0) && !this._data?.client?.policy) {
      this._toastr.error('Nenhum contrato ou documento foi enviado!');
      return;
    }

    if(!this._data?.client?.policy) {
      this.post();
    }
    else {
      this.update();
    }
  }

  protected post() {
    this._initOrStopLoading();

    this._clientService
      .createPolicyDocument(this.prepareFormData(this.form))
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
          this._dialogRef.close(true);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  protected update() {
    this.shouldUpdate = !this.shouldUpdate;
  }

  protected prepareFormData(form: FormGroup) {
    const formData = new FormData();

    Object.entries(form.controls).forEach(([key, control]) => {
      formData.append(key, control.value);
    });

    this.filesToSend.map((file, index) => {
      formData.append(`file`, file.file);
    });

    return formData;
  }

  protected openContract(client : Client) {
    window.open(client?.policy?.path, '_blank');
  }

  protected downloadContract(client: Client) {}

  protected onDeleteConfirm(client: Client) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this.deleteContract(client);
        }
      });
  }

  protected deleteContract(client: Client) {
    this._initOrStopLoading();

    this._clientService
      .deletePolicy(client.policy.id)
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
          this._dialogRef.close(true);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  // Files
  protected selectedFiles: File[] = [];
  protected filesToSend: {
    id: number;
    preview: string;
    file: File;
  }[] = [];

  public allowedTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
  ];

  @ViewChild('filesInput') fileInput!: ElementRef;

  public async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  public async onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const fileArray: File[] = Array.from(files);

    this.filesToSend = [];

    for (const file of fileArray) {
      if (this.allowedTypes.includes(file.type)) {
        let base64: string = null;

        if (file.type.startsWith('image/')) {
          base64 = await this.convertFileToBase64(file);
        }

        this.filesToSend.push({
          id: this.filesToSend.length + 1,
          preview: base64,
          file: file,
        });
      } else this._toastr.error(`${file.type} não é permitido`);
    }
  }

  public removeFileFromSendToFiles(index: number) {
    if (index > -1) {
      this.filesToSend.splice(index, 1);
      this.fileInput.nativeElement.value = '';
    }
  }

  public openFileInAnotherTab(e) {
    const fileUrl = URL.createObjectURL(e.file);

    window.open(fileUrl, '_blank');
  }
}
