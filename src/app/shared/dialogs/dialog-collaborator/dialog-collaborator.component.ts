import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '@services/user.service';
import {User} from '@models/user';
import {DialogTypeUserSectorComponent} from '../dialog-type-user-sector/dialog-type-user-sector.component';
import dayjs from 'dayjs';
import {Utils} from '@shared/utils';

@Component({
  selector: 'app-dialog-collaborator',
  templateUrl: './dialog-collaborator.component.html',
  styleUrl: './dialog-collaborator.component.scss'
})
export class DialogCollaboratorComponent {

  public isNewCollaborator: boolean = true;
  public title: string = 'Novo colaborador';
  public form: FormGroup;
  public loading: boolean = false;
  public profileImageFile: File | null = null;
  profileImage: string | ArrayBuffer = null;
  isDragOver: boolean = false;
  public userPositionEnum;
  public userSectorsEnum;

  public utils = Utils;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: { user: User },
    private readonly _dialogRef: MatDialogRef<DialogCollaboratorComponent>,
    private readonly _fb: FormBuilder,
    private readonly _dialog: MatDialog,
    private readonly _userService: UserService
  ) {
  }

  ngOnInit(): void {

    this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      cpf_cnpj: [null, [Validators.required]],
      birth_date: [null, [Validators.required]],
      company_position_id: [null, [Validators.required]],
      sector_id: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      whatsapp: [null, [Validators.required]],
      email: [null, [Validators.required]],
    })

    if (this._data?.user) {
      this.isNewCollaborator = false;
      this.title = 'Editar colaborador';
      this._fillForm(this._data.user);
      if (this._data.user.photo) {
        this.profileImage = this._data.user.photo
      }
    }

    this.updateSectorsUser();
    this.getPositionsUser();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  removeImage(event: Event): void {
    event.stopPropagation();
    this.profileImage = null;
  }


  private _fillForm(user: User): void {

    this.form.patchValue(user);
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public onSubmit(form: FormGroup): void {
    if (!form.valid) {
      form.markAllAsTouched();
    } else {

      const formData = new FormData();
      formData.append('id', form.get('id')?.value);
      formData.append('name', form.get('name')?.value);
      formData.append('cpf_cnpj', form.get('cpf_cnpj')?.value);
      formData.append('birth_date', dayjs(form.get('birth_date')?.value).format('YYYY-MM-DD'));
      formData.append('company_position_id', form.get('company_position_id')?.value);
      formData.append('sector_id', form.get('sector_id')?.value);
      formData.append('phone', form.get('phone')?.value);
      formData.append('whatsapp', form.get('whatsapp')?.value);
      formData.append('email', form.get('email')?.value);

      formData.append('photo', this.profileImageFile);

      this._dialogRef.close(formData)
    }
  }

  public openDialogUserSector() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogTypeUserSectorComponent,
        {
          ...dialogConfig
        })
      .afterClosed()
      .subscribe((res) => {
        if (!res) {
          this.updateSectorsUser();
        }
      })
  }

  // Utils
  public getPositionsUser() {
    this._userService.getPositionsUser()
      .subscribe(res => {
        this.userPositionEnum = res.data;
      })
  }

  public updateSectorsUser() {
    this._userService.getSectorsUser()
      .subscribe(res => {
        this.userSectorsEnum = res.data;
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
}
