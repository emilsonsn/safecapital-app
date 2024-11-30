import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-header-page-component',
  templateUrl: './header-page.component.html',
  styleUrl: './header-page.component.scss',
  animations: [
    trigger('showFilters', [
      state('collapsed,void', style({overflow: 'hidden' })),
      state('expanded', style({overflow: 'scroll'})),
    ]),
    trigger('filterExpand', [
      state('collapsed,void', style({height: '0', minHeight: '0' })),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('400ms 0ms cubic-bezier(0.2, 0.0, 0.5, 1)')),
    ]),
  ]
})
export class HeaderPageComponent {

  @Input()
  hasFilter : boolean = true;

  public showFilter = signal(false);


  public toggleShowFilter() {
    this.showFilter.set(!this.showFilter());
  }

}
