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
import { SessionQuery } from '@store/session.query';

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
  protected onOpenChat: EventEmitter<Solicitation> =
    new EventEmitter<Solicitation>();

  @Output()
  protected onOpenSolicitationDetails: EventEmitter<Solicitation> =
    new EventEmitter<Solicitation>();
  
  public user_id: number;
  
  constructor(
    readonly _sessionQuery: SessionQuery,
  ){}

  ngOnInit(){
    this._sessionQuery.user$.subscribe((user) => {
      this.user_id = user?.id;
    });
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
    const solicitation: Solicitation =
      this.data[keys[currentContainerIndex]][event.currentIndex];

    solicitation.status = this.status[currentContainerIndex].slug;

    this.itemMoved.emit(solicitation);
  }

  private getContainerIndex(container: CdkDropList): number {
    return this.dropLists.toArray().indexOf(container);
  }

  // Utils
  protected getEmojiForStatus(status: string): string {
    switch (status) {
      case 'Recebido':
        return '📥';
      case 'Em Análise':
        return '🔍';
      case 'Esperando imobiliária':
        return '⏳';
      case 'Pagamento provisionado':
        return '💳';
      case 'Finalizado':
        return '✅';
      default:
        return '❓';
    }
  }

  protected borderColors = {
    Received: '#007bff',
    UnderAnalysis: '#ffc107',
    Awaiting: '#f76e00',
    PaymentProvisioned: '#abff00',
    Completed: '#28a745',
  };

  protected getBorderColor(status: SolicitationStatusEnum) {
    return this.borderColors[status];
  }

  protected getUnreadMessageCount(item: Solicitation): number {
    if (!item.messages?.length) return 0;

    const currentUserId = this.user_id;
    const reversedMessages = [...item.messages].reverse();

    let count = 0;

    for (const message of reversedMessages) {
      if (message.user_id === currentUserId) break;
      count++;
    }

    return count;
  }
}
