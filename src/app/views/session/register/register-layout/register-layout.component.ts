import { Component, Input } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-register-layout',
  templateUrl: './register-layout.component.html',
  styleUrl: './register-layout.component.scss',
})
export class RegisterLayoutComponent {

  @Input()
  protected options: AnimationOptions = {
    path: '/assets/json/register_animation.json',
  };

  constructor() {}

  ngOnInit(): void {}
}
