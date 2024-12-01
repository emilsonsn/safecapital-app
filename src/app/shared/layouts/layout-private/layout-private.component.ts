import { Component, ElementRef, Renderer2 } from '@angular/core';
import { IMenuItem } from '@models/ItemsMenu';
import { SidebarService } from '@services/sidebar.service';
import { Subscription } from 'rxjs';
import { User } from '@models/user';
import { UserService } from '@services/user.service';
import { ApiResponse } from '@models/application';
import { SessionService } from '@store/session.service';
import { SessionQuery } from '@store/session.query';

@Component({
  selector: 'app-layout-private',
  templateUrl: './layout-private.component.html',
  styleUrl: './layout-private.component.scss',
})
export class LayoutPrivateComponent {
  public permitedMenuItem: IMenuItem[] = [];

  public menuItem: IMenuItem[] = [
    {
      label: 'Home',
      icon: 'fa-solid fa-house',
      route: '/painel/home',
      active: true,
    },
    // {
    //   label: 'Pedidos',
    //   icon: 'fa-solid fa-box',
    //   route: '/painel/orders'
    // },
    // {
    //   label: 'Fornecedores',
    //   icon: 'fa-solid fa-truck',
    //   route: '/painel/provider'
    // },
    // {
    //   label: 'Obras',
    //   icon: 'fa-solid fa-person-digging',
    //   route: '/painel/construction'
    // },
    {
      label: 'Clientes',
      icon: 'fa-solid fa-user-tie',
      route: '/painel/client',
    },
    // {
    //   label: 'Serviços',
    //   icon: 'fa-solid fa-tools',
    //   route: '/painel/test'
    // },
    {
      label: 'Parceiros',
      icon: 'fa-solid fa-user-tie',
      route: '/painel/partners',
      active: false,
      children: [
        {
          label: 'Parceiros',
          icon: 'fa-solid fa-user-tie',
          route: '/painel/partners',
        },
        {
          label: 'Análise de Parceiros',
          icon: 'fa-solid fa-chart-simple',
          route: '/painel/partners/analysis',
        },
      ],
    },
    {
      label: 'Chamados',
      icon: 'fa-solid fa-bookmark',
      route: '/painel/solicitation',
    },
    {
      label: 'Usuários',
      icon: 'fa-solid fa-users',
      route: '/painel/collaborator',
    },
    {
      label: 'Configurações',
      icon: 'fa-solid fa-gear',
      route: '/painel/settings'
    },
  ];

  protected isMobile: boolean = window.innerWidth >= 1000;
  private resizeSubscription: Subscription;
  user: User;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private readonly _sidebarService: SidebarService,
    private readonly _userService: UserService,
    private readonly _sessionService: SessionService,
    private readonly _sessionQuery: SessionQuery
  ) {}

  ngOnInit(): void {
    document.getElementById('template').addEventListener('click', () => {
      this._sidebarService.retractSidebar();
    });

    this._sessionQuery.user$.subscribe((user) => {
      if (user) {
        this.user = user;

        if (user?.role == 'Admin' ) {
          this.permitedMenuItem = this.menuItem;
        }
        else if (user?.role == 'Manager') {
          this.permitedMenuItem = this.menuItem.filter(
            (item) =>
              item.label == 'Home' ||
              item.label == 'Clientes' ||
              item.label == 'Chamados' ||
              item.label == 'Parceiros'
          );
        }
        else if (user?.role == 'Client') {
          this.permitedMenuItem = this.menuItem.filter(
            (item) =>
              item.label == 'Home' ||
              item.label == 'Clientes' ||
              item.label == 'Chamados'
          );
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
}
