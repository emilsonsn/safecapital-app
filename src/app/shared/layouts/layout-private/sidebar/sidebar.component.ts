import { Component, Input, SimpleChanges } from '@angular/core';
import { IMenuItem } from '@models/ItemsMenu';
import { SidebarService } from '@services/sidebar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() menuItem: IMenuItem[] = [];

  constructor(
    protected readonly _sidebarService: SidebarService,
    protected readonly router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menuItem'] && changes['menuItem'].currentValue) {
      this.updateActiveRoutes();
    }
  }

  private updateActiveRoutes() {
    this.menuItem.forEach((item) => {
      item.active = this.router.url === item.route;

      if (item.children) {
        item.children.forEach(
          (child) => (child.active = this.router.url === child.route)
        );
      }
    });
  }

  public toggleShowSidebar() {
    this._sidebarService.showSidebar.set(false);
  }

  public toggleDropdown(item: IMenuItem): void {
    item.isOpen = !item.isOpen;
  }

  public navigateToRoute(item: IMenuItem, event?: Event): void {
    event.stopPropagation();

    this.menuItem.forEach((item) => {
      item.active = false;

      if (item.children) {
        item.children.forEach((child) => (child.active = false));
      }
    });

    if (item.route) {
      this.router.navigate([item.route]).then((_) => {
        item.active = true;
      });
    }
  }

  routerActive(child: IMenuItem) {
    return child.active;
  }
}
