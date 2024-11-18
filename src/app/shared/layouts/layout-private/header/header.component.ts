import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {IMenuItem} from "@models/ItemsMenu";
import {SidebarService} from '@services/sidebar.service';
import {User} from "@models/user";
import {AuthService} from "@services/auth.service";
import { SessionService } from '@store/session.service';
import { SessionQuery } from '@store/session.query';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() menuItem: IMenuItem[] = [];
  activeLabel: string = '';
  show_dropdown = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar() {
    event.stopPropagation();
    this._sidebarService.showSidebar.set(true);
  }

  constructor(
    protected router: Router,
    private readonly _sidebarService: SidebarService,
    private readonly _authService: AuthService,
    private readonly _sessionService : SessionService,
    private readonly _sessionQuery : SessionQuery
  ) {
  }

  ngOnInit() {
    this.updateActiveLabel();
    this.router.events.subscribe(() => {
      this.updateActiveLabel();
    });

    this._sessionService.getUserFromBack().subscribe();

  }

  private updateActiveLabel() {
    const currentUrl = this.router.url;
    const activeItem = this.menuItem.find(item => item.route === currentUrl);
    this.activeLabel = activeItem ? activeItem.label : '';
  }

  protected readonly console = console;


  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.show_dropdown = !this.show_dropdown;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown') && this.show_dropdown) {
      this.show_dropdown = false;
    }
  }

  // Utils
  @Input() user!: User;

  public get isMobile() {
    return this._sidebarService.mobile();
  }

  public get isSidebarOpen() {
    return this._sidebarService.showSidebar();
  }


  logout() {
    this._authService.logout();
  }
}
