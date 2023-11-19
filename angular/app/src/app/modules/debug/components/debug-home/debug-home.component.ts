import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebugOptionsComponent } from '../debug-options/debug-options.component';

@Component({
  selector: 'bcz-debug-home',
  standalone: true,
  imports: [CommonModule, DebugOptionsComponent],
  templateUrl: './debug-home.component.html',
  styleUrl: './debug-home.component.scss'
})
export class DebugHomeComponent {

}
