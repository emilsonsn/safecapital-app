import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { afterNextRender, Component, inject, Inject, Injector, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from '@models/client';
import { Solicitation, SolicitationCategoryEnum } from '@models/solicitation';
import { ClientService } from '@services/client.service';
import { SolicitationService } from '@services/solicitation.service';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';
import { Utils } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, finalize, map, ReplaySubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dialog-solicitation',
  templateUrl: './dialog-solicitation.component.html',
  styleUrl: './dialog-solicitation.component.scss',
})
export class DialogSolicitationComponent {
  // Utils
  public utils = Utils;
  protected _onDestroy = new Subject<void>();

  public isNewSolicitation: boolean = true;

  // Form
  public form: FormGroup;
  public loading: boolean = false;

  // Filters
  protected clientSelect: Client[] = [];

  protected clientCtrl: FormControl<any> = new FormControl<any>(null);
  protected clientFilterCtrl: FormControl<any> = new FormControl<string>('');
  protected filteredClients: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );

  protected statuses = Object.values(SolicitationCategoryEnum).filter(status => status != SolicitationCategoryEnum.Default);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data: { solicitation : Solicitation },
    private readonly _dialogRef: MatDialogRef<DialogSolicitationComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _utilsService: UtilsService,
    private readonly _solicitationService : SolicitationService,
    private readonly _userService: UserService,
    private readonly _clientService: ClientService
  ) {
    this.getUsersFromBack();
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      contract_number : [null],
      subject : [null, [Validators.required]],
      category : [null, [Validators.required]],
      status : [this._data?.solicitation?.status ?? 'Received'],
    });

    if (this._data?.solicitation) {
      this.isNewSolicitation = false;
      this.form.patchValue(this._data?.solicitation);
      this.form.disable();
    }
  }

  public onSubmit(): void {
    if (!this.form.valid || this.loading) {
      this.form.markAllAsTouched();
      this._toastr.error('Preencha todos os campos!');
      return;
    }

    if (this.isNewSolicitation) {
      this.post();
    }
  }

  protected post() {
    this._initOrStopLoading();

    this._solicitationService.post(this.form.getRawValue())
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
          this._dialogRef.close(true);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      })
  }

  protected prepareFormData(form: FormGroup) {
    const formData = new FormData();

    Object.entries(form.controls).forEach(([key, control]) => {
      formData.append(key, control.value);
    });

    return formData;
  }

  // Filters
  protected prepareFilterClientCtrl() {
      this.clientFilterCtrl.valueChanges
        .pipe(
          takeUntil(this._onDestroy),
          debounceTime(100),
          map((search: string | null) => {
            if (!search) {
              return this.clientSelect.slice();
            } else {
              search = search.toLowerCase();
              return this.clientSelect.filter(
                (user) => user.id.toString().toLowerCase().includes(search)
              );
            }
          })
        )
        .subscribe((filtered) => {
          this.filteredClients.next(filtered);
        });
    }

    // Getters

    public getUsersFromBack() {
      this._clientService.getList().subscribe((res) => {
        this.clientSelect = res.data;

        this.filteredClients.next(
          this.clientSelect.slice()
        );

        this.prepareFilterClientCtrl();
      });
    }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public onCancel(): void {
    this._dialogRef.close();
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
