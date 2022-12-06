import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {NgxGraphOrgTreeComponent} from "./ngx-graph-org-tree/ngx-graph-org-tree";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgxGraphModule} from "./lib/ngx-graph.module";

@NgModule({
  declarations: [
    AppComponent,
    NgxGraphOrgTreeComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    NgxGraphModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
