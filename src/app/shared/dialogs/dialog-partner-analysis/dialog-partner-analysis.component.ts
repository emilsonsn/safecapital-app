import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  afterNextRender,
  Component,
  inject,
  Inject,
  Injector,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Request } from '@models/request';
import { Status } from '@models/status';
import { StatusUser, User } from '@models/user';
import { UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-partner-analysis',
  templateUrl: './dialog-partner-analysis.component.html',
  styleUrl: './dialog-partner-analysis.component.scss',
})
export class DialogPartnerAnalysisComponent {
  public form: FormGroup;
  public loading: boolean = false;
  public title: string = 'Dados da Solicitação';
  justification = false;

  protected fields = [
    {
      slug: 'name',
      title: 'Nome',
    },
    {
      slug: 'surname',
      title: 'Sobrenom',
    },
    {
      slug: 'email',
      title: 'E-mail',
    },
    {
      slug: 'company_name',
      title: 'Empresa',
    },
    {
      slug: 'cnpj',
      title: 'CNPJ',
    },
    {
      slug: 'creci',
      title: 'CRECI',
    },
    {
      slug: 'phone',
      title: 'Telefone',
    },
    {
      slug: 'created_at',
      title: 'Data da Solicitação',
    },
  ];

  // Select
  protected statuses = Object.values(StatusUser).filter(status => status != StatusUser.Pending);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data: User,
    private readonly _dialogRef: MatDialogRef<DialogPartnerAnalysisComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _userService: UserService
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      validation: [null, Validators.required],
      justification: [null],
    });

    this.form.get('validation')?.valueChanges.subscribe((status: string) => {
      const justificationControl = this.form.get('justification');

      if (status === StatusUser.Refused || status === StatusUser.Return) {
        justificationControl?.setValidators([Validators.required]);
        this.justification = true;
      } else {
        justificationControl?.clearValidators();
      }

      justificationControl?.updateValueAndValidity();
    });
  }

  public validate(user_id: number, user) {
    this._userService
      .validateUser(user_id, user)
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success('Usuário ativado com sucesso!');
          this._dialogRef.close(true);
        },
        error: (error) => {
          this._toastr.error('Ocorreu um erro ao ativar o usuário.');
        },
      });
  }

  public onConfirm(): void {
    if (!this.form.valid || this.loading) return;

    this._initOrStopLoading();

    this.validate(this._data?.id, {
      ...this.form.getRawValue()
    });
  }

  // Files
  public openFileInAnotherTab(e) {
    const fileUrl = URL.createObjectURL(e.file);

    window.open(fileUrl, '_blank');
  }

  // Utils
  public prepareFormData(request: Request) {
    const orderFormData = new FormData();

    Object.keys(request).forEach((key) => {
      orderFormData.append(key, request[key]);
    });

    return orderFormData;
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public onCancel(): void {
    this._dialogRef.close(false);
  }

  // Imports
  // TextArea
  private _injector = inject(Injector);

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    afterNextRender(
      () => {
        this.autosize.resizeToFitContent(true);
      },
      {
        injector: this._injector,
      }
    );
  }
}
