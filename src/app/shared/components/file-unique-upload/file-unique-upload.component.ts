import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RequiredFilesEnum } from '@app/views/session/register/register/register.component';
import { ToastrService } from 'ngx-toastr';

export interface FileUniqueProps {
  id: number;
  file: File | null;
  file_name: string | null;
  preview: string | ArrayBuffer | null;
  category: RequiredFilesEnum | string;
}

@Component({
  selector: 'app-file-unique-upload',
  templateUrl: './file-unique-upload.component.html',
  styleUrl: './file-unique-upload.component.scss',
})
export class FileUniqueUploadComponent {
  // Utils
  @Input() public containsImage: boolean = true;

  @Input() public disabled: boolean = false;

  // Info
  @Input() public category: RequiredFilesEnum | string;

  @Input() public fileUnique: FileUniqueProps = {
    id: 0,
    category: null,
    file: null,
    file_name: '',
    preview: '',
  };

  protected isDragOver: boolean = false;

  // Emitters
  @Output() onFileChange: EventEmitter<FileUniqueProps> =
    new EventEmitter<FileUniqueProps>();
  @Output() onFileDelete: EventEmitter<FileUniqueProps> =
    new EventEmitter<FileUniqueProps>();

  // Utils
  private defaultValues: FileUniqueProps = {
    id: 0,
    category: null,
    file: null,
    file_name: '',
    preview: null,
  };

  public allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  constructor(private readonly _toastr: ToastrService) {}
  ngOnInit() {
    if (this.category) {
      this.defaultValues.category = this.category;
    }
  }

  protected onFileSelect(e: Event): void {
    if (this.disabled) return;

    const file = (e.target as HTMLInputElement).files?.[0];

    if (!this.allowedTypes.includes(file.type)) {
      this._toastr.error(`${file.type} não é permitido`);
      return;
    }

    if (file) this.insertFile(file);
  }

  // Drag
  protected onDragOver(e: DragEvent): void {
    if (this.disabled) return;

    e.preventDefault();
    this.isDragOver = true;
  }

  protected onDragLeave(e: DragEvent): void {
    if (this.disabled) return;

    this.isDragOver = false;
  }

  protected onDrop(e: DragEvent): void {
    if (this.disabled) return;

    e.preventDefault();
    this.isDragOver = false;

    const file = e.dataTransfer?.files[0];

    if (!this.allowedTypes.includes(file.type)) {
      this._toastr.error(`${file.type} não é permitido`);
      return;
    }

    this.clearFileUnique();

    if (file) this.insertFile(file);
  }

  // Utils
  protected triggerFileInput(): void {
    if (this.disabled) return;

    const fileInput = document.getElementById(
      this.category + '-input'
    ) as HTMLInputElement;
    fileInput.click();
  }

  protected insertFile(file: File) {
    if (this.disabled) return;

    this.fileUnique.file = file;
    this.fileUnique.file_name = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.fileUnique.preview = reader.result;
    };
    reader.readAsDataURL(file);

    this.onFileChange.emit(this.fileUnique);
  }

  protected open(e: Event) {
    if (this.disabled) return;

    e.stopPropagation();

    let fileUrl;

    if (!this.fileUnique.preview.toString().startsWith('data:'))
      fileUrl = this.fileUnique.preview;
    else fileUrl = URL.createObjectURL(this.fileUnique.file);

    window.open(fileUrl, '_blank');
  }

  protected remove(e?: Event): void {
    if (this.disabled) return;

    e?.stopPropagation();

    this.onFileDelete.emit(this.fileUnique);

    this.clearFileUnique();
  }

  protected clearFileUnique() {
    if (this.disabled) return;

    const fileInput = document.getElementById(
      this.category + '-input'
    ) as HTMLInputElement;

    fileInput.value = '';
    this.fileUnique = { ...this.defaultValues };
  }
}
