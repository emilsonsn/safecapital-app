import { Component } from '@angular/core';
import { UserRole } from '@models/user';
import { SessionQuery } from '@store/session.query';

@Component({
  selector: 'app-defaulter-manager',
  templateUrl: './defaulter-manager.component.html',
  styleUrl: './defaulter-manager.component.scss',
})
export class DefaulterManagerComponent {
  protected role: UserRole;

  constructor(private readonly _sessionQuery: SessionQuery) {}

  ngOnInit() {
    this._sessionQuery.user$.subscribe((user) => {
      if (user) this.role = user.role;
    });
  }
}
