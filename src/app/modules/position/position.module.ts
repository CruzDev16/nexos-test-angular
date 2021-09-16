import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PositionRoutingModule } from './position-routing.module';
import { PositionComponent } from './components/position/position.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PositionComponent
  ],
  imports: [
    CommonModule,
    PositionRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PositionModule { }
