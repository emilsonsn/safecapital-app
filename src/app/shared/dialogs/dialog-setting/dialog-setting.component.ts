import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { SessionQuery } from '@store/session.query';
import { ClientStatus } from '@models/client';
import { Settings } from '@models/settings';
import { SettingService } from '@services/settings.service';
import { afterNextRender } from '@angular/core';

@Component({
  selector: 'app-dialog-setting',
  templateUrl: './dialog-setting.component.html',
  styleUrl: './dialog-setting.component.scss',
})
export class DialogSettingComponent {
  protected myUser;
  public isNewSetting = true;
  public title = 'Novo ';
  public loading = false;
  protected pendingLimit = false;

  public form: FormGroup;
  public statuses: string[] = [ClientStatus.Pending, ClientStatus.Disapproved, ClientStatus.Approved];

  public processCategoriesOptions: string[] = [
    'DIREITO À EDUCAÇÃO',
    'DIREITO ADMINISTRATIVO E OUTRAS MATÉRIAS DE DIREITO PÚBLICO',
    'DIREITO AMBIENTAL',
    'DIREITO ASSISTENCIAL',
    'DIREITO CIVIL',
    'DIREITO DA CRIANÇA E DO ADOLESCENTE',
    'DIREITO DA SAÚDE',
    'DIREITO DO CONSUMIDOR',
    'DIREITO DO TRABALHO',
    'DIREITO ELEITORAL',
    'DIREITO ELEITORAL E PROCESSO ELEITORAL DO STF',
    'DIREITO INTERNACIONAL',
    'DIREITO MARÍTIMO',
    'DIREITO PENAL',
    'DIREITO PENAL MILITAR',
    'DIREITO PREVIDENCIÁRIO',
    'DIREITO PROCESSUAL CIVIL E DO TRABALHO',
    'DIREITO PROCESSUAL PENAL',
    'DIREITO PROCESSUAL PENAL MILITAR',
    'DIREITO TRIBUTÁRIO',
    'QUESTÕES DE ALTA COMPLEXIDADE, GRANDE IMPACTO E REPERCUSSÃO',
    'REGISTROS PÚBLICOS',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) protected readonly _data: Settings,
    private readonly _dialogRef: MatDialogRef<DialogSettingComponent>,
    private readonly _fb: FormBuilder,
    private readonly _dialog: MatDialog,
    private readonly _settingService: SettingService,
    private readonly _toastr: ToastrService,
    private readonly _sessionQuery: SessionQuery
  ) {}

  ngOnInit(): void {
    this._sessionQuery.user$.subscribe((user) => (this.myUser = user));

    this.form = this._fb.group({
      id: [null],
      description: [null, [Validators.required]],
      start_score: [null, [Validators.required]],
      end_score: [null, [Validators.required]],
      has_pending_issues: [null, [Validators.required]],
      has_law_processes: [null, [Validators.required]],
      max_pending_value: [null],
      process_categories: [[]],
      status: [null, [Validators.required]],
    });

    if (this._data?.id) {
      this.isNewSetting = false;
      this.title = 'Editar ';
      this.managePendingLimit(this._data?.has_pending_issues);
      this.form.patchValue(this._data);
    }    

    if(! this._data?.process_categories?.length){
      this.ensureAllProcessCategoriesIfEmpty();
    }

    this.form.get('has_pending_issues')?.valueChanges.subscribe((v: boolean) => this.managePendingLimit(v));

    this.form.get('has_law_processes')?.valueChanges.subscribe((v: boolean) => {
      const ctrl = this.form.get('process_categories');
      if (v) {
        ctrl?.setValidators([Validators.required, Validators.minLength(1)]);
      } else {
        ctrl?.clearValidators();
        ctrl?.setValue([]);
      }
      ctrl?.updateValueAndValidity();
    });
  }

  public onSubmit(form: FormGroup): void {
    if (!form.valid || this.loading) {
      form.markAllAsTouched();
      return;
    }
    const data = form.getRawValue();
    this.isNewSetting ? this.post(data) : this.patch(data);
  }

  protected patch(setting) {
    this._initOrStopLoading();
    this._settingService
      .patch(setting.id, setting)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
            this._dialogRef.close(true);
          }
        },
        error: (err) => this._toastr.error(err.error.error),
      });
  }

  protected post(setting) {
    this._initOrStopLoading();
    this._settingService
      .create(setting)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
            this._dialogRef.close(true);
          }
        },
        error: (err) => this._toastr.error(err.error.error),
      });
  }

  protected managePendingLimit(status: boolean) {
    this.pendingLimit = !!status;
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  protected _initOrStopLoading() {
    this.loading = !this.loading;
  }

  private _injector = Injector.create({providers: []});
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    afterNextRender(() => this.autosize.resizeToFitContent(true), { injector: this._injector });
  }

  private ensureAllProcessCategoriesIfEmpty(): void {
    const ctrl = this.form.get('process_categories');
    if (ctrl && (!ctrl.value || ctrl.value.length === 0)) {
      ctrl.setValue([...this.processCategoriesOptions]);
    }
  }  
}
