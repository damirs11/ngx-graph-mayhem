import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {NgxGraphOrgTreeComponent} from "./ngx-graph-org-tree/ngx-graph-org-tree";
import {NgxGraphModule} from "@local/ngx-graph";
import {CustomGraphDirective} from "./ngx-graph-org-tree/custom-graph.directive";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  declarations: [
    AppComponent,
    NgxGraphOrgTreeComponent,
    CustomGraphDirective,
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
