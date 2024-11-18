import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AvatarComponent} from "@shared/components/avatar/avatar/avatar.component";
import {MatIconModule} from "@angular/material/icon";


const components = [AvatarComponent]

@NgModule({
    declarations: components,
    imports: [
        CommonModule,
        MatIconModule
    ],
    exports: components
})
export class AvatarModule {
}
