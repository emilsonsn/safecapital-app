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
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  FilesSolicitationEnum,
  Solicitation,
  SolicitationCategoryEnum,
  SolicitationItem,
} from '@models/solicitation';
import { ClientService } from '@services/client.service';
import { SolicitationService } from '@services/solicitation.service';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';
import { FileUniqueProps } from '@shared/components/file-unique-upload/file-unique-upload.component';
import { Utils } from '@shared/utils';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  finalize,
  map,
  ReplaySubject,
  Subject,
  takeUntil,
} from 'rxjs';
import { DialogMailMessageComponent } from '../dialog-email-message/dialog-email-message.component';

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
    protected readonly _data: {
      solicitation: Solicitation;
      default: boolean;
      hasFiles: boolean;
    },
    private readonly _dialogRef: MatDialogRef<DialogSolicitationComponent>,
    private readonly _fb: FormBuilder,
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _solicitationService: SolicitationService,
    private readonly _clientService: ClientService
  ) {
    this.getClientsFromBack();
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      contract_number: [null, [Validators.required]],
      subject: ['', [Validators.required]],
      category: [null, [Validators.required]],
      status: [this._data?.solicitation?.status ?? 'Received'],
      items: this._fb.array([]),
    });

    this.requiredFiles = Object.values(FilesSolicitationEnum).map(
      (category) => ({
        id: 0,
        preview: '',
        file: null,
        file_name: '',
        category,
      })
    );

    if (this._data?.solicitation) {
      this.isNewSolicitation = false;
      this.form.patchValue(this._data?.solicitation);

      if (this._data?.solicitation?.items) {
        this._data?.solicitation?.items?.forEach((item) => {
          this.items.push(this.createItemFromData(item));
        });
      }

      this._data?.solicitation?.attachments.forEach((fileFromBack, index) => {
        if (
          Object.values(FilesSolicitationEnum).includes(
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
        }
      });

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

      this.form.get('subject').removeValidators(Validators.required);
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

    for(let id of this.itemsToRemove) {
      this.deleteItem(id);
    }

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

    const notKeys = [
      'items'
    ];

    Object.entries(form.controls).forEach(([key, control]) => {
      if (notKeys.includes(key)) return;
      formData.append(key, control.value);
    });

    this.requiredFilesToUpdate.map((file, index) => {
      formData.append(`attachments[${index}][description]`, file.category);
      formData.append(`attachments[${index}][file]`, file.file);
    });

    this.items.controls.map((item, index) => {
      formData.append(`items[${index}][description]`, item.get('description')?.value);
      formData.append(`items[${index}][due_date]`, dayjs(item.get('due_date')?.value).format("YYYY-MM-DD"));
      formData.append(`items[${index}][value]`, item.get('value')?.value);
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
    this.requiredFilesToUpdate = this.requiredFilesToUpdate.filter(
      (f) => f.file_name !== file.file_name
    );
  }

  // Itens
  protected itemsToRemove : number[] = []
  public get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  private createItemFromData(item: SolicitationItem): FormGroup {
    return this._fb.group({
      id: [item?.id],
      value: [{ value: item?.value }, [Validators.required]],
      description: [item?.description, [Validators.required]],
      due_date: [item?.due_date, [Validators.required]],
    });
  }

  public openMail(): void {
    const dialogRef = this._dialog.open(DialogMailMessageComponent, {
      width: '500px',
      data: {
        contract_number: this._data.solicitation.contract_number
      }
    });

    dialogRef
    .afterClosed()
    .subscribe((data) => {
      if (data) {
        this.loading = true;
        this._clientService.sendMail(data)
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: (res) => {
              this._toastr.success(res.message);
            },
            error: (error) => {
              this._toastr.error(error?.message ?? 'Erro inesperado.');
            }
        });
      }
    });
  }  

  public onDeleteItem(index: number): void {
    this.items.removeAt(index);
    if (this.items.value[index].id) {
      this.itemsToRemove.push(this.items.value[index].id);
    }
  }

  public createItem(): FormGroup {
    return this._fb.group({
      id: [null],
      value: [null, Validators.required],
      description: [null, Validators.required],
      due_date: [null, Validators.required],
    });
  }


  public pushItem(): void {
    this.items.push(this.createItem());
  }

  private deleteItem(id : number) {
    this._solicitationService.deleteItem(id).subscribe({
      next: () => {},
      error: (err) => {
        this._toastr.error(err.error.error);
      },
    });
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
        .filter((client) => client.policys && client.policys.length > 0)
        .map((client) => client.policys[0].contract_number);

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
