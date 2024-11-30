import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Solicitation } from '@models/solicitation';

@Component({
  selector: 'app-solicitation-chat',
  templateUrl: './solicitation-chat.component.html',
  styleUrl: './solicitation-chat.component.scss',
})
export class SolicitationChatComponent {

  protected messageText : string = '';

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    protected readonly _data: { solicitation : Solicitation },
    private _bottomSheetRef: MatBottomSheetRef<SolicitationChatComponent>
  ) {}

  ngOnInit() {
    console.log(this._data);
  }

  protected sendMessage() {

  }

  // Utils
  protected close() {
    this._bottomSheetRef.dismiss();
  }
}
