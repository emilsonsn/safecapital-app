import { Component } from '@angular/core';
import {environment} from "@env/environment";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  protected version: string = environment.version
}
