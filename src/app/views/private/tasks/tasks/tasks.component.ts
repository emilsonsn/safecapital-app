import {Component} from '@angular/core';
import {Kanban} from "@models/Kanban";
import {TaskService} from "@services/task.service";
import {Task, TaskStatus} from "@models/Task";
import {ApiResponse} from "@models/application";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {DialogTaskComponent} from "@shared/dialogs/dialog-task/dialog-task.component";
import {UserService} from "@services/user.service";
import {User} from "@models/user";
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
  data: Kanban<Task> = {}
  users: User[] = [];
  status: TaskStatus[] = []

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _taskService: TaskService,
    private readonly _userService: UserService,
    private cdr: ChangeDetectorRef
  ) {

    _taskService.getStatusTasks().subscribe((response: ApiResponse<TaskStatus[]>) => {
      if (response.data) {
        this.status = response.data;
        response.data.forEach((status: TaskStatus) => {
          this.data[status.name] = []
        })
      }
    })


    this._userService.getUsersAll().subscribe((response: ApiResponse<User[]>) => {
      if (response.data) {
        this.users = response.data
      }
    })
    this.getTasks();
  }

  ngOnInit(){
  }


  getTasks() {
    this._taskService.getTasks().subscribe((response: ApiResponse<Task[]>) => {
      if (response.data) {
        response.data.forEach((task: Task) => {
          const name = this.status.find((status) => status.id === task.task_status_id)?.name;
          if(name) this.data[name].push(task);
        })
        this.cdr.detectChanges();
      }
    })
  }

  taskMoved($event: Task) {
    this._taskService.updateTask($event).subscribe(
      {
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      }
    );
  }


  openDialogTask(task?: Task) {
    this._dialog
      .open(DialogTaskComponent, {
        data: {task, status: this.status, users: this.users},
        width: '80%',
        maxWidth: '850px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res: FormData) => {
        if (res) {
          const id = +res.get('id');
          id ? this._patchTask(id, res) : this._postTask(res);
        }
      });
  }

  private _postTask(res: FormData) {

    this._taskService.createTask(res).subscribe(
      {
        next: (response) => {

          this.status.forEach((status: TaskStatus) => {
            this.data[status.name] = []
          })

          this.getTasks();
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      }
    );
  }

  deleteTask($event: Task) {
    if (!$event?.id) return;
    
    this._taskService.deleteTask($event).subscribe(
      {
        next: (response: ApiResponse<Task>) => {
          if (response.data) {
            this._toastr.success('Tarefa excluída com sucesso!');

            this.status.forEach((status: TaskStatus) => {
              this.data[status.name] = []
            })
            this.getTasks();
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      }
    );
  }

  private _patchTask(id: number, res: FormData) {
    this._taskService.putTask(id, res).subscribe(
      {
        next: (response: ApiResponse<Task>) => {
          if (response.data) {
            this._toastr.success('Tarefa alterada com sucesso!');

            this.status.forEach((status: TaskStatus) => {
              this.data[status.name] = []
            })

            this.getTasks();
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      }
    );
  }
}
