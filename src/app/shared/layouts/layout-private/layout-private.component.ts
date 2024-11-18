import {Component, ElementRef, Renderer2} from '@angular/core';
import {IMenuItem} from "@models/ItemsMenu";
import {SidebarService} from '@services/sidebar.service';
import {Subscription} from "rxjs";
import {User} from "@models/user";
import {UserService} from "@services/user.service";
import {ApiResponse} from "@models/application";
import { SessionService } from '@store/session.service';
import { SessionQuery } from '@store/session.query';

@Component({
  selector: 'app-layout-private',
  templateUrl: './layout-private.component.html',
  styleUrl: './layout-private.component.scss'
})
export class LayoutPrivateComponent {

  public permitedMenuItem: IMenuItem[] = [];

  public menuItem: IMenuItem[] = [
    {
      label: 'Home',
      icon: 'fa-solid fa-house',
      route: '/painel/home',
      active: true
    },
    {
      label: 'Pedidos',
      icon: 'fa-solid fa-box',
      route: '/painel/orders'
    },
    {
      label: 'Solicitações',
      icon: 'fa-solid fa-bookmark',
      route: '/painel/requests'
    },
    {
      label: 'Colaboradores',
      icon: 'fa-solid fa-users',
      route: '/painel/collaborator'
    },
    {
      label: 'Fornecedores',
      icon: 'fa-solid fa-truck',
      route: '/painel/provider'
    },
    {
      label: 'Obras',
      icon: 'fa-solid fa-person-digging',
      route: '/painel/construction'
    },
    {
      label: 'Clientes/Contratantes',
      icon: 'fa-solid fa-user-tie',
      route: '/painel/client'
    },
    {
      label: 'Serviços',
      icon: 'fa-solid fa-tools',
      route: '/painel/services'
    },
    {
      label: 'Tarefas',
      icon: 'fa-solid fa-tasks',
      route: '/painel/tasks'
    }
  ]

  protected isMobile: boolean = window.innerWidth >= 1000;
  private resizeSubscription: Subscription;
  user: User;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private readonly _sidebarService: SidebarService,
    private readonly _userService: UserService,
    private readonly _sessionService: SessionService,
    private readonly _sessionQuery : SessionQuery
  ) { }


  ngOnInit(): void {

    document.getElementById('template').addEventListener('click', () => {
      this._sidebarService.retractSidebar();
    });

    this._sessionQuery.user$.subscribe(user => {
      if(user) {
        this.user = user;

        if(user?.company_position.position == 'Requester')
          this.permitedMenuItem = this.menuItem.filter(item =>
            item.label == 'Pedidos' ||
            item.label == 'Solicitações' || 
            item.label == 'Fornecedores'
          );
        else
          this.permitedMenuItem = this.menuItem;
      }
    })

  }


  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

}
