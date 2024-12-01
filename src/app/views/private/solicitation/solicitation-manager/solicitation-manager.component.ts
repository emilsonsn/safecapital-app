import { Component } from '@angular/core';
import { User, UserRole } from '@models/user';
import { SessionQuery } from '@store/session.query';

@Component({
  selector: 'app-solicitation-manager',
  templateUrl: './solicitation-manager.component.html',
  styleUrl: './solicitation-manager.component.scss'
})
export class SolicitationManagerComponent {

  protected role : UserRole;

  constructor(
    private readonly _sessionQuery : SessionQuery,
  ) { }

  ngOnInit() {
    this._sessionQuery.user$.subscribe((user) => {
      if(user) this.role = user.role;
    });
  }

}
