import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  afterNextRender,
  Component,
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
import { FilesSolicitationEnum, Solicitation, SolicitationCategoryEnum } from '@models/solicitation';
import { ClientService } from '@services/client.service';
import { SolicitationService } from '@services/solicitation.service';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';
import { FileUniqueProps } from '@shared/components/file-unique-upload/file-unique-upload.component';
import { Utils } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  finalize,
  map,
  ReplaySubject,
  Subject,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-dialog-solicitation',
  templateUrl: './dialog-solicitation.component.html',
  styleUrl: './dialog-solicitation.component.scss',
})
export class DialogSolicitationComponent {
  // Utils
  public utils = Utils;
  protected _onDestroy = new Subject<void>();
  protected requiredFilesEnum = FilesSolicitationEnum;


  public isNewSolicitation: boolean = true;

  // Form
  public form: FormGroup;
  public loading: boolean = false;

  // Filters
  protected contractNumberSelect: string[] = [];

  protected contractNumberCtrl: FormControl<any> = new FormControl<any>(null);
  protected contractNumberFilterCtrl: FormControl<any> =
    new FormControl<string>('');
  protected filteredContractNumbers: ReplaySubject<any[]> = new ReplaySubject<
    any[]
  >(1);

  protected statuses: string[] = Object.values(SolicitationCategoryEnum).filter(
    (status) => status != SolicitationCategoryEnum.Default
  );

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data: { solicitation: Solicitation; default: boolean },
    private readonly _dialogRef: MatDialogRef<DialogSolicitationComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _solicitationService: SolicitationService,
    private readonly _clientService: ClientService
  ) {
    this.getClientsFromBack();
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      contract_number: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      category: [null, [Validators.required]],
      status: [this._data?.solicitation?.status ?? 'Received'],
    });

    this.requiredFiles = Object.values(FilesSolicitationEnum).map((category) => ({
      id: 0,
      preview: '',
      file: null,
      file_name: '',
      category,
    }));

    if (this._data?.solicitation) {
      this.isNewSolicitation = false;
      this.form.patchValue(this._data?.solicitation);
      this.form.disable();
    }

    if (this._data?.default) {
      this.statuses = Object.values(SolicitationCategoryEnum).filter(
        (status) => status == SolicitationCategoryEnum.Default
      );

      this.form
        .get('category')
        .patchValue(SolicitationCategoryEnum.Default.toString());
      this.form.get('category').disable();
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

    this._solicitationService
      .post(this.prepareFormData(this.form))
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

  protected prepareFormData(form: FormGroup) {
    const formData = new FormData();

    Object.entries(form.controls).forEach(([key, control]) => {
      formData.append(key, control.value);
    });

    this.requiredFilesToUpdate.map((file, index) => {
      formData.append(
        `attachments[${index}][description]`,
        file.category
      );
      formData.append(
        `attachments[${index}][file]`,
        file.file
      );
    });

    return formData;
  }

  // Files
  protected requiredFiles: FileUniqueProps[] = [];
  protected requiredFilesToUpdate: FileUniqueProps[] = [];

  protected filesToRemove: number[] = [];


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
  }


  // Filters
  protected prepareFilterContractNumberCtrl() {
    this.contractNumberFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.contractNumberSelect.slice();
          } else {
            search = search.toLowerCase();
            return this.contractNumberSelect.filter((contract) =>
              contract.toString().toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredContractNumbers.next(filtered);
      });
  }

  // Getters
  public getClientsFromBack() {
    this._clientService.getList().subscribe((res) => {
      this.contractNumberSelect = res.data
        .filter((client) => client.policy?.contract_number) // Remove valores nulos ou undefined
        .map((client) => client.policy.contract_number);

      this.filteredContractNumbers.next(this.contractNumberSelect.slice());

      this.prepareFilterContractNumberCtrl();
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
