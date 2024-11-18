import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginatorIntl} from "@angular/material/paginator";
import {PaginatorPtBR} from "./config/paginator";
import {ComponentsModule} from "./components/components.module";
import {DialogsModule} from "./dialogs/dialogs.module";
import {DirectivesModule} from "./directives/directives.module";
import {PipesModule} from "./pipes/pipes.module";
import {TablesModule} from "./tables/tables.module";
import {LayoutsModule} from "@shared/layouts/layouts.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComponentsModule,
    DialogsModule,
    DirectivesModule,
    LayoutsModule,
    PipesModule,
    TablesModule
  ],
  exports: [
    ComponentsModule,
    DialogsModule,
    DirectivesModule,
    LayoutsModule,
    PipesModule,
    TablesModule
  ],
  providers: [
    {provide: MatPaginatorIntl, useClass: PaginatorPtBR},
  ],
})
export class SharedModule {
}
