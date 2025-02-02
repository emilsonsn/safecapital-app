import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

export interface FileUniqueProps {
  id: number;
  file: File | null;
  file_name: string | null;
  preview: string | ArrayBuffer | null;
  category: string;
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
  @Input() public category: string;

  @Input() public fileFromBack : FileUniqueProps;

  protected fileUnique: FileUniqueProps = {
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

  constructor() {}
  ngOnInit() {
    if (this.fileFromBack) {
      this.fileUnique.id = this.fileFromBack.id;
      this.defaultValues.id = this.fileFromBack.id;
    }

    if (this.category) {
      this.fileUnique.category = this.category;
      this.defaultValues.category = this.category;
    }

    if(this.fileFromBack) {
      this.fileUnique = {...this.fileFromBack};
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
      const { fileFromBack } = changes;

      if (
        fileFromBack?.previousValue &&
        fileFromBack?.currentValue !== fileFromBack?.previousValue
      ) {
        console.log(fileFromBack);
        this.fileUnique = {...this.fileFromBack};
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
    if (file) this.insertFile(file);
  }

  // Utils
  protected triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
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

    const fileUrl = URL.createObjectURL(this.fileUnique.file);

    window.open(fileUrl, '_blank');
  }

  protected remove(e: Event): void {
    e.stopPropagation();
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;

    this.onFileDelete.emit(this.fileUnique);

    fileInput.value = '';
    this.fileUnique = { ...this.defaultValues };
  }

  private defaultValues : FileUniqueProps = {
    id: 0,
    category: null,
    file: null,
    file_name: '',
    preview: '',
  }
}
