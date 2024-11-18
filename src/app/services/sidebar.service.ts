import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public mobile = signal(true);
  public showSidebar = signal(false);
  public isMobile = signal(window.matchMedia('(max-width: 1000px)').matches);

  constructor() {
    effect(() => {
      if (this.isMobile()) {
        this.mobile.set(true);
      } else {
        this.mobile.set(false);
      }
    }, { allowSignalWrites: true });

    window.addEventListener('resize', () => {
      this.retractSidebar();
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateIsMobile);
  }

  public toggleShowsidebar = () => {
		this.showSidebar.set(!this.showSidebar());
	}

  public retractSidebar = () => {
    this.updateIsMobile();
    this.updateSidebar();
  }

  public updateSidebar = () => {

    if(this.isMobile()) {
      this.mobile.set(true);
      this.showSidebar.set(false);
    }
    else {
      this.mobile.set(false);
      this.showSidebar.set(false);
    }

  }


  // Utils
  public updateIsMobile = () => {
    this.isMobile.set(window.matchMedia('(max-width: 1199px)').matches);
  }

}
