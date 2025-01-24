import { Component, ElementRef, Renderer2 } from '@angular/core';
import { IMenuItem } from '@models/ItemsMenu';
import { SidebarService } from '@services/sidebar.service';
import { Subscription } from 'rxjs';
import { User, UserRole } from '@models/user';
import { UserService } from '@services/user.service';
import { ApiResponse } from '@models/application';
import { SessionService } from '@store/session.service';
import { SessionQuery } from '@store/session.query';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogFirstAccessComponent } from '@shared/dialogs/dialog-first-access/dialog-first-access.component';
import { ToastrService } from 'ngx-toastr';

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
      icon: 'fa-solid fa-handshake',
      route: '/painel/partners',
      active: false,
      children: [
        {
          label: 'Parceiros',
          icon: 'fa-solid fa-user',
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
      label: 'Inadimplência',
      icon: 'fa-solid fa-circle-exclamation',
      route: '/painel/defaulter',
    },
    {
      label: 'Usuários',
      icon: 'fa-solid fa-users',
      route: '/painel/users',
    },
    {
      label: 'Configurações',
      icon: 'fa-solid fa-gear',
      route: '/painel/settings',
      active: false,
      children: [
        {
          label: 'Taxa',
          icon: 'fa-solid fa-money-bill',
          route: '/painel/settings/tax',
        },
        {
          label: 'Crédito',
          icon: 'fa-solid fa-sliders',
          route: '/painel/settings/credit',
        },
      ],
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
    private readonly _sessionQuery: SessionQuery,
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    document.getElementById('template').addEventListener('click', () => {
      this._sidebarService.retractSidebar();
    });


    this._sessionQuery.user$.subscribe((user) => {
      // if(!user) {
      //   this._sessionService.getUserFromBack().subscribe();
      // }
      if (user) {
        this.user = user;

        if (user?.role == 'Admin') {
          this.permitedMenuItem = this.menuItem;
        } else if (user?.role == 'Manager') {
          this.permitedMenuItem = this.menuItem.filter(
            (item) =>
              item.label == 'Home'
              || item.label == 'Clientes'
              || item.label == 'Chamados'
              || item.label == 'Inadimplência'
              || item.label == 'Parceiros'
          );
        } else if (user?.role == 'Client') {
          this.permitedMenuItem = this.menuItem.filter(
            (item) =>
              item.label == 'Home'
              || item.label == 'Clientes'
              || item.label == 'Inadimplência'
              || item.label == 'Chamados'
          );
        }

        // PRIMEIRO ACESSO
        if (!user.terms && user.role == UserRole.Client) {
          this.openFirstAccessDialog();
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  protected openFirstAccessDialog() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '725px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogFirstAccessComponent, {
        ...dialogConfig,
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this._toastr.success('Seja bem vindo!');
          } else {
            this.openFirstAccessDialog();
          }
        },
      });
  }
}
