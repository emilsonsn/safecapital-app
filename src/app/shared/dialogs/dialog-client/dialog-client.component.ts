import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CurrencyPipe } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Inject,
  Injector,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequiredFilesEnum } from '@app/views/session/register/register/register.component';
import { Client, ClientStatus, PaymentFormEnum } from '@models/client';
import { User } from '@models/user';
import { Estados } from '@models/utils';
import { ClientService } from '@services/client.service';
import { TaxSettingService } from '@services/tax-setting.service';
import { UtilsService } from '@services/utils.service';
import { FileUniqueProps } from '@shared/components/file-unique-upload/file-unique-upload.component';
import { Utils } from '@shared/utils';
import { SessionQuery } from '@store/session.query';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, finalize, map, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-dialog-client',
  templateUrl: './dialog-client.component.html',
  styleUrl: './dialog-client.component.scss',
  providers: [CurrencyPipe],
})
export class DialogClientComponent {
  protected taxPercentage: number = 0;
  protected taxValue: number = 0;

  // Utils
  public utils = Utils;
  public isNewClient: boolean = true;
  public title: string = 'Novo cliente';
  protected myUser: User;
  protected canEdit: boolean = true;
  public loading: boolean = false;
  protected tabIndex: number = 0;
  protected habilitateCondominumFee = false;
  protected clientStatuses = ClientStatus;
  protected requiredFilesEnum = RequiredFilesEnum;

  // Form
  public form: FormGroup;

  // Selects
  public statusSelect = Object.values(this.clientStatuses).slice(); // .filter(s => !s.includes(this.clientStatuses.WaitingPayment))

  public paymentFormSelect: { label: string; value: PaymentFormEnum }[] = [
    {
      label: 'À Vista',
      value: PaymentFormEnum.INCASH,
    },
    {
      label: 'Faturado',
      value: PaymentFormEnum.INVOICED,
    },
  ];

  public citys: string[] = [];
  public cityCtrl: FormControl<any> = new FormControl<any>(null);
  public cityFilterCtrl: FormControl<any> = new FormControl<string>('');
  public filteredCitys: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public states: string[] = Object.values(Estados);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data: { client: Client },
    private readonly _dialogRef: MatDialogRef<DialogClientComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _utilsService: UtilsService,
    private readonly _clientService: ClientService,
    private readonly _taxService: TaxSettingService,
    private readonly _currencyPipe: CurrencyPipe,
    protected readonly _sessionQuery: SessionQuery
  ) {
    this._taxService.getList().subscribe({
      next: (res) => {
        this.taxPercentage = +res.percentage;
        this.taxValue = +res.tax;

        this.updatePolicyValue();
      },
      error: (err) => {
        this._toastr.error(
          'Ocorreu um erro ao carregar o dado das taxas! Verificar o suporte, o valor da apólice pode não condizer!' +
            err.error.error
        );
      },
    });
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      id: [''],
      status: ['Pending', [Validators.required]],

      // Dados Pessoais
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      observations: [''],

      // Endereço
      cep: ['', [Validators.required]],
      street: ['', [Validators.required]],
      neighborhood: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      number: ['', [Validators.required]],
      complement: [''],

      // Financeiro
      payment_form: ['', [Validators.required, Validators.min(0.01)]],
      policy_value: ['', [Validators.required, Validators.min(0.01)]],
      rental_value: ['', [Validators.required, Validators.min(0.01)]],
      property_tax: ['', [Validators.required, Validators.min(0.01)]],
      condominium_fee: [0, [Validators.min(0.01)]],
    });

    this.form.get('policy_value').disable();

    this.requiredFiles = Object.values(RequiredFilesEnum).map((category) => ({
      id: 0,
      preview: null,
      file: null,
      file_name: '',
      category,
    }));

    if (this._data?.client) {
      this.isNewClient = false;
      this.title = 'Editar cliente';
      this.form.patchValue(this._data?.client);
      this.atualizarCidades(this._data?.client?.state);

      this._data?.client?.attachments.forEach((fileFromBack, index) => {
        if (
          Object.values(RequiredFilesEnum).includes(
            this.requiredFilesEnum[fileFromBack?.description]
          )
        ) {
          const index = this.requiredFiles.findIndex(
            (file) => file.category == fileFromBack.description
          );

          if (index != -1) {
            this.requiredFiles[index] = {
              id: fileFromBack.id,
              preview: fileFromBack.path,
              file: null,
              file_name: fileFromBack.filename,
              category: fileFromBack.description,
            };
          }
        } else {
          this.filesFromBack.push({
            index: this.filesFromBack.length,
            id: fileFromBack.id,
            path: fileFromBack.path,
            fileName: fileFromBack.filename,
            description: fileFromBack.description,
          });
        }
      });

      if (this.myUser?.role == 'Client') {
        this.form.disable();
      }

      if (this._data.client.condominium_fee > 0) {
        this.habilitateCondominumFee = true;
      }
    }

    // CEP
    this.form.get('state').valueChanges.subscribe((res) => {
      this.atualizarCidades(res);
    });

    this.form.get('cep').valueChanges.subscribe((res) => {
      this.autocompleteCep(res);
    });

    this.cityFilterCtrl.valueChanges.pipe().subscribe(() => {
      this.filterCitys();
    });

    // MyUser
    this._sessionQuery.user$.subscribe((user) => {
      this.myUser = user;

      // Regras de Negócio para Manager <-> Clientes
      if (this.myUser?.role == 'Manager') {
        if (
          ![
            this.clientStatuses.Pending,
            this.clientStatuses.Approved,
            this.clientStatuses.Disapproved,
          ].includes(this._data?.client?.status)
        ) {
          this.desabilatateForm();
        }
      } else if (this.myUser?.role == 'Client' && !this.isNewClient) {
        if (
          ![
            this.clientStatuses.Pending,
            this.clientStatuses.Approved,
            this.clientStatuses.Disapproved,
          ].includes(this._data?.client?.status)
        ) {
          this.desabilatateForm();
        }
      }
    });

    // Regras
    this.form.valueChanges.pipe(distinctUntilChanged()).subscribe((res) => {
      if (res?.rental_value) {
        this.updatePolicyValue();
      } else if (res?.condominium_fee) {
        this.updatePolicyValue();
      } else if (res?.payment_form) {
        this.updatePolicyValue();
      } else if (res?.property_tax) {
        this.updatePolicyValue();
      }

      // const rentalValue = res?.rental_value ? +res.rental_value : 0;
      // const condominiumFee = res?.condominium_fee ? +res.condominium_fee : 0;
      // const propertyTax = res?.property_tax ? +res.property_tax : 0;

      // const total = rentalValue + condominiumFee + propertyTax;
      // const newPolicyValue = parseFloat((total / 12 + total * this.taxPercentage + this.taxValue).toFixed(2));

      // if (this.form.get('policy_value')?.value !== newPolicyValue) {
      //   this.form.get('policy_value')?.patchValue(newPolicyValue, { emitEvent: false });
      // }
    });

    if (this.habilitateCondominumFee) {
      this.form.get('condominium_fee').enable();
    } else {
      this.form.get('condominium_fee').disable();
    }
  }

  public onSubmit(form: FormGroup): void {
    if (!form.valid || this.loading) {
      form.markAllAsTouched();
      this._toastr.error('Preencha todos os campos!');
      return;
    }

    if (this.isNewClient) {
      if (
        (!this.requiredFiles.some((file) => file.file || file.preview)) &&
        (!this.filesToSend || this.filesToSend.length === 0)
      ){
        this._toastr.error('Nenhum arquivo foi enviado!');
        return;
      }
    }

    if (this.filesToSend) {
      if (this.filesToSend.some((file) => !file.description)) {
        this._toastr.error('Preencha a descrição!');
        return;
      }
    }

    if (this.isNewClient) {
      this.post();
    } else {
      this.removeFiles();
      this.patch(this._data.client.id);
    }
  }

  protected post() {
    this._initOrStopLoading();

    this._clientService
      .post(this.prepareFormData(this.form))
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
            this._dialogRef.close(true);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  protected patch(id: number) {
    this._initOrStopLoading();

    this._clientService
      .patch(id, this.prepareFormData(this.form))
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
            this._dialogRef.close(true);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  protected prepareFormData(form: FormGroup) {
    const formData = new FormData();

    Object.entries(form.controls).forEach(([key, control]) => {
      if (key == 'birthday') {
        formData.append(key, dayjs(control.value).format('YYYY-MM-DD'));
      } else {
        formData.append(key, control.value);
      }
    });

    this.filesToSend.map((file, index) => {
      formData.append(`attachments[${index}][description]`, file.description);
      formData.append(`attachments[${index}][file]`, file.file);
    });

    this.requiredFilesToUpdate.map((file, index) => {
      formData.append(
        `attachments[${index + this.filesToSend?.length}][description]`,
        file.category
      );
      formData.append(
        `attachments[${index + this.filesToSend?.length}][file]`,
        file.file
      );
    });

    return formData;
  }

  protected updatePolicyValue() {
    const total =
      Math.abs(this.rentalValue) +
      Math.abs(this.condominiumFee) +
      Math.abs(this.propertyTax);
    const newPolicyValue = parseFloat((total * 1.2).toFixed(2));

    if (this.form.get('policy_value')?.value != newPolicyValue) {
      this.form
        .get('policy_value')
        ?.patchValue(newPolicyValue, { emitEvent: false });
    }
  }

  protected removeFiles() {
    for (let idFile of this.filesToRemove) {
      // this._initOrStopLoading();

      this._clientService
        .deleteAttachment(idFile)
        .pipe(
          finalize(() => {
            // this._initOrStopLoading();
          })
        )
        .subscribe({
          next: (res) => {},
          error: (err) => {
            this._toastr.error(
              `Erro ao deletar arquivo ID ${idFile}! - ${err}`
            );
          },
        });
    }
  }

  // Utils
  public atualizarCidades(uf: string): void {
    this._utilsService
      .obterCidadesPorEstado(uf)
      .pipe(map((res) => res.map((city) => city.nome)))
      .subscribe({
        next: (names) => {
          this.citys = names;
          this.filteredCitys.next(this.citys.slice());
        },
        error: (error) => {
          console.error('Erro ao obter cidades:', error);
        },
      });
  }

  protected filterCitys() {
    if (!this.citys) {
      return;
    }
    let search = this.cityFilterCtrl.value;
    if (!search) {
      this.filteredCitys.next(this.citys.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredCitys.next(
      this.citys.filter((city) => city.toLowerCase().indexOf(search) > -1)
    );
  }

  validateCellphoneNumber(control: any) {
    const phoneNumber = control.value;
    if (phoneNumber && phoneNumber.replace(/\D/g, '').length !== 11) {
      return false;
    }
    return true;
  }

  validatePhoneNumber(control: any) {
    const phoneNumber = control.value;
    if (phoneNumber && phoneNumber.replace(/\D/g, '').length !== 10) {
      return false;
    }
    return true;
  }

  public autocompleteCep(cep: string) {
    if (cep.length == 8) {
      this._utilsService.getAddressByCep(cep).subscribe((res) => {
        if (res.erro) {
          this._toastr.error('CEP Inválido para busca!');
        } else {
          this.form.get('street').patchValue(res.logradouro);
          this.form.get('neighborhood').patchValue(res.bairro);
          this.form.get('city').patchValue(res.localidade);
          this.form.get('state').patchValue(res.uf);
        }
      });
    }
  }

  protected toggleCondiminiumFee() {
    if (this.form.get('condominium_fee').enabled) {
      this.form.get('condominium_fee').patchValue(0);
      this.form.get('condominium_fee').disable();
      this.form.get('condominium_fee').setValidators([]);
    } else {
      this.form.get('condominium_fee').enable();
      this.form.get('condominium_fee').setValidators(Validators.required);
    }
  }

  protected getPolicyDescription() {
    const policyValue = this.form?.get('policy_value')?.value;
    const installmentValue = policyValue / 12;

    if (this.form?.get('payment_form').value == PaymentFormEnum.INCASH) {
      return this._currencyPipe.transform(
        policyValue,
        'BRL',
        'symbol',
        '1.2-2'
      );
    } else if (
      this.form?.get('payment_form').value == PaymentFormEnum.INVOICED
    ) {
      return `12x de ${this._currencyPipe.transform(
        installmentValue,
        'BRL',
        'symbol',
        '1.2-2'
      )}`;
    } else {
      return this._currencyPipe.transform(0, 'BRL', 'symbol', '1.2-2');
    }
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public desabilatateForm(): void {
    this.form.disable();
    this.canEdit = false;
    this.habilitateCondominumFee = false;
    this.form.get('condominium_fee').disable();
  }

  // Files
  protected selectedFiles: File[] = [];
  protected filesToSend: {
    id: number;
    preview: string;
    file: File;
    fileName: string;
    description: string;
  }[] = [];

  protected requiredFiles: FileUniqueProps[] = [];
  protected requiredFilesToUpdate: FileUniqueProps[] = [];

  protected filesToRemove: number[] = [];
  protected filesFromBack: {
    index: number;
    id: number;
    description: string;
    fileName: string;
    path: string;
  }[] = [];

  public allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
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
          fileName: file.name,
          description: null,
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

  public openFileInAnotherTab(e, isToCreateObjectUrl: boolean) {
    let fileUrl: string;
    if (isToCreateObjectUrl) fileUrl = URL.createObjectURL(e);
    else fileUrl = e;

    window.open(fileUrl, '_blank');
  }

  public prepareFileToRemoveFromBack(fileId, index) {
    this.filesFromBack.splice(index, 1);
    this.filesToRemove.push(fileId);
  }

  protected addRequiredFile(index: number, file: FileUniqueProps) {
    if (index >= 0 && index < this.requiredFiles.length)
      this.requiredFilesToUpdate.push(file);
    else
      console.error(
        `Índice inválido: ${index}. O índice deve estar entre 0 e ${
          this.requiredFiles.length - 1
        }.`
      );
  }

  protected deleteRequiredFile(index: number, file: FileUniqueProps) {
    if (file?.id) this.filesToRemove.push(file.id);
    this.requiredFilesToUpdate = this.requiredFilesToUpdate.filter(
      (f) => f.file_name !== file.file_name
    );
  }

  // Getters
  protected get paymentForm() {
    return this.form.get('payment_form').value;
  }

  protected get policyValue() {
    return this.form.get('policy_value').value;
  }

  protected get rentalValue() {
    return this.form.get('rental_value').value;
  }

  protected get condominiumFee() {
    return this.form.get('condominium_fee').value;
  }

  protected get propertyTax() {
    return this.form.get('property_tax').value;
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
