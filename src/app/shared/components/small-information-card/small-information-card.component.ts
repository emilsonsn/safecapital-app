import {Component, Input} from '@angular/core';
import {ISmallInformationCard} from "@models/cardInformation";


@Component({
  selector: 'app-small-information-card',
  templateUrl: './small-information-card.component.html',
  styleUrl: './small-information-card.component.scss'
})
export class SmallInformationCardComponent {
  @Input() data!: ISmallInformationCard;

}
