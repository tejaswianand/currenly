import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldLabelComponent } from './component/field-label/field-label';
import { InputComponent } from './component/input/input';
import { ButtonComponent } from './component/button/button';




@NgModule({
  imports: [
    CommonModule,
    FieldLabelComponent, InputComponent, ButtonComponent,
  ], exports: [FieldLabelComponent, InputComponent, ButtonComponent,]
})
export class SharedModule { }
