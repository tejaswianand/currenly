import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-field-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './field-label.html',
  styleUrls: ['./field-label.css'],
})
export class FieldLabelComponent {
  @Input() label: string = '';
  @Input() for: string = '';
}
