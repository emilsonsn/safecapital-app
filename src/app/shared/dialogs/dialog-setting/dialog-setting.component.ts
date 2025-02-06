import {
  afterNextRender,
  Component,
  inject,
  Inject,
  Injector,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserService } from '@services/user.service';
import { User } from '@models/user';
import dayjs from 'dayjs';
import { Utils } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { SessionQuery } from '@store/session.query';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ClientStatus } from '@models/client';
import { Settings } from '@models/settings';
import { SettingService } from '@services/settings.service';

@Component({
  selector: 'app-dialog-setting',
  templateUrl: './dialog-setting.component.html',
  styleUrl: './dialog-setting.component.scss',
})
export class DialogSettingComponent {
  // Utils
  protected myUser: User;
  public isNewSetting: boolean = true;
  public title: string = 'Novo ';
  public loading: boolean = false;
  public utils = Utils;
  protected pendingLimit = false;

  // Form
  public form: FormGroup;
  public statuses: string[] = Object.keys(ClientStatus).map((key) => key);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data: Settings,
    private readonly _dialogRef: MatDialogRef<DialogSettingComponent>,
    private readonly _fb: FormBuilder,
    private readonly _dialog: MatDialog,
    private readonly _settingService: SettingService,
    private readonly _toastr: ToastrService,
    private readonly _sessionQuery: SessionQuery
  ) {}

  ngOnInit(): void {
    this._sessionQuery.user$.subscribe((user) => {
      this.myUser = user;
    });

    this.form = this._fb.group({
      id: [null],
      description: [null, [Validators.required]],
      start_score: [null, [Validators.required]],
      end_score: [null, [Validators.required]],
      has_pending_issues: [null, [Validators.required]],
      pending_limit: [null, [Validators.required]],
      status: [null],
    });

    if (this._data?.id) {
      this.isNewSetting = false;
      this.title = 'Editar ';
      this.managePendingLimit(this._data?.has_pending_issues);
      this.form.patchValue(this._data);
    }

    this.form.get('has_pending_issues')?.valueChanges.subscribe((status: boolean) => {
      this.managePendingLimit(status);
    });
  }

  public onSubmit(form: FormGroup): void {
    if (!form.valid || this.loading) {
      form.markAllAsTouched();
      return;
    }

    const data = form.getRawValue();

    if (this.isNewSetting) {
      this.post(data);
    } else {
      this.patch(data);
    }
  }

  protected patch(setting) {
    this._initOrStopLoading();
    const id = setting.id;
    this._settingService
      .patch(id, setting)
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
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  // Utils
  protected managePendingLimit(status: boolean) {
    const pendingLimitControl = this.form.get('pending_limit');

    if (status) {
      pendingLimitControl?.setValidators([Validators.required]);
      this.pendingLimit = true;
    } else {
      pendingLimitControl?.clearValidators();
      this.pendingLimit = false;
    }

    pendingLimitControl?.updateValueAndValidity();
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  protected _initOrStopLoading() {
    this.loading = !this.loading;
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
