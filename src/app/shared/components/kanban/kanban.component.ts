import {Component, EventEmitter, HostListener, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {Kanban} from "@models/Kanban";
import {Task, TaskStatus, TaskStatusEnum} from "@models/Task";


@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})
export class KanbanComponent {
  protected readonly Object = Object;
  @Input() data: Kanban<Task> = {}
  @ViewChildren(CdkDropList) dropLists: QueryList<CdkDropList>;
  @Output() taskMoved: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() taskClicked: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() taskDeleted: EventEmitter<Task> = new EventEmitter<Task>();
  @Input() status!: TaskStatus[];

  drop(event: CdkDragDrop<Task[]>) {
    // const previousContainerIndex = this.getContainerIndex(event.previousContainer);
    const currentContainerIndex = this.getContainerIndex(event.container);

    if (event.previousContainer === event.container) {
      // Quando muda de posição na mesma coluna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Quando muda de coluna
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

    }

    this.changeColumn(currentContainerIndex, event)

  }

  private changeColumn(currentContainerIndex: number, event: CdkDragDrop<Task[]>) {
    const keys: (string | number)[] = Object.keys(this.data) as (keyof Kanban<Task>)[];
    const task: Task = this.data[keys[currentContainerIndex]].find(item => item?.id === event.container?.data[0]?.id);
    task.task_status_id = currentContainerIndex + 1;
    this.taskMoved.emit(task);
  }

  private getContainerIndex(container: CdkDropList): number {
    return this.dropLists.toArray().indexOf(container);
  }


  getEmojiForStatus(status: string): string {
    switch (status) {
      case TaskStatusEnum.Pending:
        return '⏳'; // Emoji de relógio de areia
      case TaskStatusEnum.InProgress:
        return '🚧'; // Emoji de obra
      case TaskStatusEnum.Completed:
        return '✅'; // Emoji de marca de verificação
      case TaskStatusEnum.Canceled:
        return '❌'; // Emoji de X vermelho
      case TaskStatusEnum.Archived:
        return '📁'; // Emoji de pasta
      default:
        return '❓'; // Emoji de interrogação para status desconhecido
    }
  }

  getBorderColor(task_status_id: number) {
    return this.status[task_status_id - 1].color
  }

  onBoxClick(item: Task) {
    this.taskClicked.emit(item)
  }

  @HostListener("click", ["$event"])
  public deleteTask(event: Event, task: Task): void
  {
    event.stopPropagation();
    this.taskDeleted.emit(task)
  }
}
