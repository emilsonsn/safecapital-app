
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Supplier, SupplierType } from '@models/supplier';
import { DialogTypeProviderComponent } from '../dialog-type-provider/dialog-type-provider.component';
import { TypeProviderService } from '@services/type-provider.service';
import { Utils } from '@shared/utils';
import { Estados } from '@models/utils';
import { map, ReplaySubject } from 'rxjs';
import { UtilsService } from '@services/utils.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-provider',
  templateUrl: './dialog-provider.component.html',
  styleUrl: './dialog-provider.component.scss'
})
export class DialogProviderComponent {

  public isNewProvider: boolean = true;
  public title: string = 'Novo fornecedor';

  public form: FormGroup;

  public providerTypeEnum;

  public loading : boolean = false;

  public cep : string;
  public states : string[] = Object.values(Estados);

  public citys : string[] = [];
  public cityCtrl: FormControl<any> = new FormControl<any>(null);
  public cityFilterCtrl: FormControl<any> = new FormControl<string>('');
  public filteredCitys: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public utils = Utils;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: {provider: Supplier},
    private readonly _dialogRef: MatDialogRef<DialogProviderComponent>,
    private readonly _fb: FormBuilder,
    private readonly _dialog: MatDialog,
    private readonly _typeProviderService: TypeProviderService,
    private readonly _utilsService : UtilsService,
    private readonly _toastr : ToastrService
  ) { }

  ngOnInit(): void {

  this.form = this._fb.group({
      id: [null],
      fantasy_name: [null, [Validators.required]],
      name: [null, [Validators.required]],
      cnpj: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      whatsapp: [null, [Validators.required]],
      type_supplier_id: [null, [Validators.required]],
      email: [null, [Validators.required]],
      address: [null, [Validators.required]],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]],
      number: [null, [Validators.required]],
    })

    if (this._data?.provider) {
      this.isNewProvider = false;
      this.title = 'Editar provedor';
      this._fillForm(this._data.provider);
    }

    this.form.get('state').valueChanges.subscribe(res => {
      this.atualizarCidades(res);
    })

    this.cityFilterCtrl.valueChanges
      .pipe()
      .subscribe(() => {
        this.filterCitys();
      });

    this.updateTypeProviders();
  }

  private _fillForm(provider: Supplier): void {

    this.form.patchValue(provider);
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public onSubmit(form: FormGroup): void {
    if(!form.valid){
      form.markAllAsTouched();
    }else{
      this._dialogRef.close(form.getRawValue())
    }
  }

  public openDialogTypeProvider() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogTypeProviderComponent,
      {
        ...dialogConfig
      })
      .afterClosed()
      .subscribe( (res) => {
        if(!res) {
          this.updateTypeProviders();
        }
      })
  }

  // Utils
  public updateTypeProviders() {
    this._typeProviderService.getTypes()
      .subscribe(res => {
        this.providerTypeEnum = res.data;
      })
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

  public atualizarCidades(uf: string): void {
    this._utilsService.obterCidadesPorEstado(uf)
      .pipe(
        map(res => res.map(city => city.nome))
      )
      .subscribe({
        next: (names) => {
          this.citys = names;
          this.filteredCitys.next(this.citys.slice());
        },
        error: (error) => {
          console.error('Erro ao obter cidades:', error);
        }
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
      this.citys.filter(city => city.toLowerCase().indexOf(search) > -1)
    );
  }

  public autocompleteCep() {

    if(this.cep.length == 8 ) {
      this._utilsService.getAddressByCep(this.cep)
        .subscribe(res => {
          if(res.erro) {
            this._toastr.error('CEP Inválido para busca!');
          }
          else {
            this.form.get('address').patchValue(res.logradouro);
            this.form.get('city').patchValue(res.localidade);
            this.form.get('state').patchValue(res.uf);
          }
        })
    }

  }

}
