import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from '@models/client';
import { Estados } from '@models/utils';
import { UtilsService } from '@services/utils.service';
import { Utils } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';
import { map, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-dialog-client',
  templateUrl: './dialog-client.component.html',
  styleUrl: './dialog-client.component.scss'
})
export class DialogClientComponent {

  public isNewClient: boolean = true;
  public title: string = 'Novo cliente';

  public form: FormGroup;

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
    private readonly _data: {client: Client},
    private readonly _dialogRef: MatDialogRef<DialogClientComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr : ToastrService,
    private readonly _utilsService : UtilsService
  ) { }

  ngOnInit(): void {

    this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      cpf_cnpj: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      whatsapp: [null, [Validators.required]],
      email: [null, [Validators.required]],
      address: [null, [Validators.required]],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]],
      number: [null, [Validators.required]],
    })

    if (this._data?.client) {
      this.isNewClient = false;
      this.title = 'Editar cliente';
      this._fillForm(this._data.client);
    }

    this.form.get('state').valueChanges.subscribe(res => {
      this.atualizarCidades(res);
    })

    this.cityFilterCtrl.valueChanges
      .pipe()
      .subscribe(() => {
        this.filterCitys();
      });

  }

  private _fillForm(client: Client): void {

    this.form.patchValue(client);
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

  // Utils

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

