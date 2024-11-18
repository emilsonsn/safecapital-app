import {Component, Input} from '@angular/core';
import {AnimationOptions} from "ngx-lottie";

@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrl: './account-manager.component.scss'
})
export class AccountManagerComponent {
  @Input() primary_text: string = '';
  @Input() options: AnimationOptions = {};

}
