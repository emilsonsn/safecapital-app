import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client, ClientPolicy } from '@models/client';
import { User, UserRole } from '@models/user';
import { ClientService } from '@services/client.service';
import { SessionQuery } from '@store/session.query';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-client-contract',
  templateUrl: './client-contract.component.html',
  styleUrl: './client-contract.component.scss',
})
export class ClientContractComponent {

  protected form: FormGroup;

  // Utils
  protected myUser : User;
  protected UserRoleEnum = UserRole;
  protected clientPolicy : ClientPolicy = null;

  @Input()
  shouldUpdate : boolean = false;

  @Input()
  Client : Client;

  @Input()
  loading: boolean = false;

  @Output()
  onClientClick: EventEmitter<Client> = new EventEmitter<Client>();

  @Output()
  onOpenContract: EventEmitter<Client> = new EventEmitter<Client>();

  @Output()
  onContractDeleteClick: EventEmitter<Client> = new EventEmitter<Client>();

  // Não utilizado
  @Output()
  OnContractDownloadClick: EventEmitter<Client> = new EventEmitter<Client>();

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _clientService: ClientService,
    private readonly _sessionQuery : SessionQuery,
    private readonly _fb : FormBuilder,
  ) {}

  ngOnInit() {
    this._sessionQuery.user$.subscribe(user => {
      this.myUser = user;
    });

    if(this.Client) {
      this.clientPolicy = this.Client?.policy;
    }

    this.form = this._fb.group({
      contract_number: [this.clientPolicy.contract_number, [Validators.required]],
    });

    if(![UserRole.Admin, UserRole.Manager].includes(this.myUser.role)) {
      this.form?.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { shouldUpdate, loading } = changes;

    if (shouldUpdate?.currentValue || !shouldUpdate?.currentValue) {
      this.update();
    }
  }

  protected update(): void {
    if(this.loading || !this.form || this.form?.disabled) return;

    if(!this.form.valid) {
      this._toastr.error('Formulário inválido!');
      return;
    }

    this._initOrStopLoading();

    this._clientService
      .patchPolicy(this.clientPolicy?.id, this.prepareFormData(this.form))
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  protected prepareFormData(form: FormGroup) {
    const formData = new FormData();

    Object.entries(form.controls).forEach(([key, control]) => {
      formData.append(key, control.value);
    });

    return formData;
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }
}
