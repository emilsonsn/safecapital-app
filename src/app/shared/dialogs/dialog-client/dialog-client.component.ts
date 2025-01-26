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
import { Client, ClientStatus, PaymentFormEnum } from '@models/client';
import { User } from '@models/user';
import { Estados } from '@models/utils';
import { ClientService } from '@services/client.service';
import { UtilsService } from '@services/utils.service';
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

  // Form
  public form: FormGroup;

  // Selects
  // Pendente, Aprovado, Reprovado, Aceito, Ativo
  public statusSelect: { label: string; value: string }[] = [
    {
      label: 'Pendente',
      value: 'Pending',
    },
    {
      label: 'Aprovado',
      value: 'Approved',
    },
    {
      label: 'Reprovado',
      value: 'Disapproved',
    },
    {
      label: 'Aceito',
      value: 'Accepted',
    },
    {
      label: 'Ativo',
      value: 'Active',
    },
  ];

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
    private readonly _currencyPipe: CurrencyPipe,
    protected readonly _sessionQuery: SessionQuery
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      id: [null],
      status: ['Pending', [Validators.required]],

      // Dados Pessoais
      name: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      birthday: [null, [Validators.required]],
      cpf: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      email: [null, [Validators.required]],
      observations: [null],

      // Endereço
      cep: [null, [Validators.required]],
      street: [null, [Validators.required]],
      neighborhood: [null, [Validators.required]],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]],
      number: [null, [Validators.required]],
      complement: [null],

      // Financeiro
      payment_form: [null, [Validators.required, Validators.min(0.01)]],
      policy_value: [null, [Validators.required, Validators.min(0.01)]],
      rental_value: [null, [Validators.required, Validators.min(0.01)]],
      property_tax: [null, [Validators.required, Validators.min(0.01)]],
      condominium_fee: [null, [Validators.min(0.01)]],
    });

    this.form.get('policy_value').disable();

    if (this._data?.client) {
      this.isNewClient = false;
      this.title = 'Editar cliente';
      this.form.patchValue(this._data?.client);
      this.atualizarCidades(this._data?.client?.state);

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
          [
            this.clientStatuses.Approved,
            this.clientStatuses.Disapproved,
          ].includes(this._data?.client?.status)
        ) {
          this.desabilatateForm();
        }
      }
      else if (this.myUser?.role == 'Client' && !this.isNewClient) {
        this.desabilatateForm();
      }
    });

    // Regras
    this.form.valueChanges.pipe(distinctUntilChanged()).subscribe((res) => {
      const rentalValue = res?.rental_value ? +res.rental_value : 0;
      const condominiumFee = res?.condominium_fee ? +res.condominium_fee : 0;
      const propertyTax = res?.property_tax ? +res.property_tax : 0;

      const total = rentalValue + condominiumFee + propertyTax;
      const newPolicyValue = parseFloat((total * 12 * 0.1).toFixed(2));

      if (this.form.get('policy_value')?.value !== newPolicyValue) {
        this.form.get('policy_value')?.patchValue(newPolicyValue, { emitEvent: false });
      }
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
      if (!this.filesToSend || this.filesToSend.length === 0) {
        this._toastr.error('Nenhum arquivo foi enviado!');
        return;
      }
    }

    if(this.filesToSend) {
      for (let file of this.filesToSend) {
        if (!file.category) {
          this._toastr.error('Preencha a categoria!');
          return;
        }
      }
    }

    if (this.isNewClient) {
      this._postClient();
    } else {
      this._patchClient(this._data.client.id);
    }
  }

  _postClient() {
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

  _patchClient(id) {
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
      formData.append(`attachments[${index}][category]`, file.category);
      formData.append(`attachments[${index}][file]`, file.file);
    });

    return formData;
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
    category: string;
  }[] = [];

  protected filesToRemove: number[] = [];
  protected filesFromBack: {
    index: number;
    id: number;
    name: string;
    path: string; // Wasabi
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
          category: null,
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

  public prepareFileToRemoveFromBack(fileId, index) {
    this.filesFromBack.splice(index, 1);
    this.filesToRemove.push(fileId);
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
