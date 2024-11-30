import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Kanban } from '@models/Kanban';
import { Solicitation, SolicitationStatusEnum } from '@models/solicitation';

export interface KanbanSolicitationStatus {
  id: number;
  slug: SolicitationStatusEnum;
  name: string;
  color: string;
}

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
})
export class KanbanComponent {
  protected readonly Object = Object;

  @ViewChildren(CdkDropList)
  protected dropLists: QueryList<CdkDropList>;

  @Input()
  public data: Kanban<Solicitation> = {};

  @Input()
  public status!: KanbanSolicitationStatus[];

  @Output()
  protected itemMoved: EventEmitter<Solicitation> =
    new EventEmitter<Solicitation>();

  @Output()
  protected itemClicked: EventEmitter<Solicitation> =
    new EventEmitter<Solicitation>();

  @Output()
  protected itemDeleted: EventEmitter<Solicitation> =
    new EventEmitter<Solicitation>();

  protected onItemClick(item: Solicitation) {
    this.itemClicked.emit(item);
  }

  @HostListener('click', ['$event'])
  public onDeleteItemClick(event: Event, solicitation: Solicitation): void {
    // event.stopPropagation();
    if (!solicitation) return;
    this.itemDeleted.emit(solicitation);
  }

  // Kanban
  protected drop(event: CdkDragDrop<Solicitation[]>) {
    // const previousContainerIndex = this.getContainerIndex(event.previousContainer);
    const currentContainerIndex = this.getContainerIndex(event.container);

    if (event.previousContainer === event.container) {
      // Quando muda de posição na mesma coluna
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Quando muda de coluna
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.changeColumn(currentContainerIndex, event);
  }

  private changeColumn(
    currentContainerIndex: number,
    event: CdkDragDrop<Solicitation[]>
  ) {
    const keys: (string | number)[] = Object.keys(
      this.data
    ) as (keyof Kanban<Solicitation>)[];
    const solicitation: Solicitation = this.data[
      keys[currentContainerIndex]
    ][event.currentIndex];

    solicitation.status = this.status[currentContainerIndex].slug;

    this.itemMoved.emit(solicitation);
  }

  private getContainerIndex(container: CdkDropList): number {
    return this.dropLists.toArray().indexOf(container);
  }

  // Utils
  protected getEmojiForStatus(status: string): string {
    switch (status) {
      case 'Aberto':
        return '⏳';
      case 'Fechado':
        return '✅';
      default:
        return '❓';
    }
  }

  protected borderColors = {
    Open: '#ffc107',
    Closed: '#06B76C',
  };

  protected getBorderColor(status: SolicitationStatusEnum) {
    return this.borderColors[status];
  }
}
