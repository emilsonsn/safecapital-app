import {Component, Inject} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Task, TaskStatus} from "@models/Task";
import {User} from "@models/user";
import dayjs from "dayjs";
import {ToastrService} from "ngx-toastr";
import {TaskService} from "@services/task.service";

@Component({
  selector: 'app-dialog-task',
  templateUrl: './dialog-task.component.html',
  styleUrls: ['./dialog-task.component.scss']
})
export class DialogTaskComponent {
  taskForm: FormGroup;
  taskFilesList: File[] = [];
  isToEdit: boolean = false;
  protected filesFromBack: {
    index: number,
    id: number,
    name: string,
    path: string, // Wasabi
  }[] = [];
  protected filesToRemove: number[] = [];
  protected subTaskRemove: number[] = [];

  constructor(
    private fb: FormBuilder,
    private readonly _taskService: TaskService,
    private readonly _toastr: ToastrService,
    public dialogRef: MatDialogRef<DialogTaskComponent>,
    @Inject(MAT_DIALOG_DATA) protected readonly data: { task: Task, status: TaskStatus[], users: User[] }
  ) {
    this.taskForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      user_id: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      concluded_at: [null],
      description: ['', [Validators.required]],
      task_status_id: [null],
      sub_tasks: this.fb.array([]),
      tasks_files: this.fb.array([])
    });

    if (data.task) {
      this.taskForm.patchValue(data.task);

      this.data.task.files.forEach((file, index) => {
        this.filesFromBack.push({
          index: index,
          id: file.id,
          name: file.name,
          path: file.path
        });
      });

      this.data.task.sub_tasks.forEach((subTask, index) => {
        this.subTasks.push(this.fb.group({
          id: [subTask.id],
          description: [subTask.description, Validators.required],
          status: [subTask.status]
        }));
      });

    }
  }


  getFileDataUrl(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }


  get subTasks(): FormArray {
    return this.taskForm.get('sub_tasks') as FormArray;
  }

  get taskFiles(): FormArray {
    return this.taskForm.get('tasks_files') as FormArray;
  }

  addSubTask() {
    this.subTasks.push(this.fb.group({
      description: ['', Validators.required],
      status: [false]
    }));
  }

  removeSubTask(index: number, subTask: any) {
    this.subTasks.removeAt(index);
    this.subTaskRemove.push(subTask.value.id);
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.taskFilesList = Array.from(files);
    }
  }

  removeFile(index: number) {
    this.taskFilesList.splice(index, 1);
  }

  onSave() {
    if (this.taskForm.valid) {
      const formData = new FormData();

      // Adicionar campos de texto
      const formValues = this.taskForm.value;

      Object.keys(formValues).forEach(key => {
        const value = formValues[key];
        if (key === 'concluded_at' && value && value != 'null') {

          const utcDate = dayjs(value).format('YYYY-MM-DD');
          formData.append(key, utcDate);
        } else if (Array.isArray(value)) {

          value.forEach((item: any) => {
            formData.append(`${key}[]`, JSON.stringify(item));
          });
        } else {
          formData.append(key, value);
        }
      });

      // Adicionar arquivos
      this.taskFilesList.forEach(file => {
        formData.append('tasks_files[]', file);
      });

      this.filesToRemove.forEach(id => {
        this._taskService.deleteFile(id)
          .subscribe({
            next: (res) => {

            },
            error: (err) => {
              this._toastr.error(err.error.error);
            }
          })
      });

      this.subTaskRemove.forEach(id => {
        this._taskService.deleteSubTask(id)
          .subscribe({
            next: (res) => {
            },
            error: (err) => {
              this._toastr.error(err.error.error);
            }
          })
      });

      this.dialogRef.close(formData);
    } else {
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private setSubTasks(subTasks: any[]) {
    subTasks.forEach(subTask => {
      this.subTasks.push(this.fb.group({
        id: [subTask.id],
        description: [subTask.description, Validators.required],
        status: [subTask.status]
      }));
    });
  }

  private setTaskFiles(taskFiles: any[]) {
    // Para adicionar arquivos corretamente, você deve utilizar a API de arquivos se disponíveis
    taskFiles.forEach(file => {
      this.taskFilesList.push(new File([], file.name, {type: 'application/octet-stream'}));
    });
  }

  prepareFileToRemoveFromBack(id: number, index: number) {
    this.filesFromBack.splice(index, 1);
    this.filesToRemove.push(id);
  }

  protected readonly URL = URL;
}
