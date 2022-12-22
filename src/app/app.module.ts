import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {NgxGraphOrgTreeComponent} from "./ngx-graph-org-tree/ngx-graph-org-tree";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgxGraphModule} from "./lib/ngx-graph.module";
import {MatButtonModule} from "@angular/material/button";
import {MatBadgeModule} from "@angular/material/badge";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";
import { WagsFlowGraphComponent } from './wags-flow-graph/wags-flow-graph.component';

@NgModule({
  declarations: [
    AppComponent,
    NgxGraphOrgTreeComponent,
    WagsFlowGraphComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    NgxGraphModule,
    MatTooltipModule,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
