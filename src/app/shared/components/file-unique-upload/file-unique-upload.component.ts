import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { RequiredFilesEnum } from '@app/views/session/register/register/register.component';

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
  @Input() public containsImage : boolean = true;

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
  @Output() onFileChange: EventEmitter<FileUniqueProps> = new EventEmitter<FileUniqueProps>();
  @Output() onFileDelete: EventEmitter<FileUniqueProps> = new EventEmitter<FileUniqueProps>();

  // Utils
  private defaultValues : FileUniqueProps = {
    id: 0,
    category: null,
    file: null,
    file_name: '',
    preview: null,
  }

  constructor() {}
  ngOnInit() {
    if (this.category) {
      this.defaultValues.category = this.category;
    }
  }

  protected onFileSelect(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.insertFile(file);
  }

  // Drag
  protected onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = true;
  }

  protected onDragLeave(e: DragEvent): void {
    this.isDragOver = false;
  }

  protected onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = false;

    const file = e.dataTransfer?.files[0];

    this.clearFileUnique();

    if (file) this.insertFile(file);
  }

  // Utils
  protected triggerFileInput(): void {
    const fileInput = document.getElementById(this.category + '-input') as HTMLInputElement;
    fileInput.click();
  }

  protected insertFile(file: File) {
    this.fileUnique.file = file;
    this.fileUnique.file_name = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.fileUnique.preview = reader.result;
    };
    reader.readAsDataURL(file);

    this.onFileChange.emit(this.fileUnique);
  }

  protected open(e : Event) {
    e.stopPropagation();

    let fileUrl;

    if(!this.fileUnique.preview.toString().startsWith('data:')) fileUrl = this.fileUnique.preview;
    else fileUrl = URL.createObjectURL(this.fileUnique.file);

    window.open(fileUrl, '_blank');
  }

  protected remove(e?: Event): void {
    e?.stopPropagation();

    this.onFileDelete.emit(this.fileUnique);

    this.clearFileUnique();
  }

  protected clearFileUnique() {
    const fileInput = document.getElementById(this.category + '-input') as HTMLInputElement;

    fileInput.value = '';
    this.fileUnique = { ...this.defaultValues };
  }
}
