import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client, ClientPolicy, ClientStatus } from '@models/client';
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
  protected statuses = ['Accepted', 'Return', 'Refused'];
  protected clientStatus = ClientStatus;

  // Utils
  protected myUser: User;
  protected UserRoleEnum = UserRole;
  protected clientPolicy: ClientPolicy[] = null;
  protected justification: boolean = false;

  @Input()
  shouldUpdate: boolean = false;

  @Input()
  Client: Client;

  @Input()
  loading: boolean = false;

  @Output()
  onClientClick: EventEmitter<Client> = new EventEmitter<Client>();

  @Output()
  onOpenContract: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  onContractDeleteClick: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  onCloseDialog: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Não utilizado
  @Output()
  OnContractDownloadClick: EventEmitter<Client> = new EventEmitter<Client>();

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _clientService: ClientService,
    private readonly _sessionQuery: SessionQuery,
    private readonly _fb: FormBuilder
  ) {}

  ngOnInit() {
    this._sessionQuery.user$.subscribe((user) => {
      this.myUser = user;
    });

    this.form = this._fb.group({
      validation: [null, Validators.required],
      justification: [null],
    });

    this.form.get('validation')?.valueChanges.subscribe((status: string) => {
      const justificationControl = this.form.get('justification');

      if (status == 'Refused' || status == 'Return') {
        justificationControl?.setValidators([Validators.required]);
        this.justification = true;
      } else {
        justificationControl?.clearValidators();
        this.justification = false;
      }

      justificationControl?.updateValueAndValidity();
    });

    if (this.Client) {
      this.clientPolicy = this.Client?.policys;
    }
  }

  protected onSubmit() {
    if (this.loading || !this.form.valid) {
      this._toastr.error('Formulário inválido!');
      return;
    }

    this.initOrStopLoading();
    this._clientService
      .analysisContract(this.Client.id, this.form.getRawValue())
      .pipe(
        finalize(() => {
          this.initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
          this.onCloseDialog.emit(true);
        },
        error: (err) => {
          this._toastr.error(err.error.message);
        },
      });
  }

  protected initOrStopLoading() {
    this.loading = !this.loading;
  }
}
