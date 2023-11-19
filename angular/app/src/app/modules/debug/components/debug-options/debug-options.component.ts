import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebugService } from '../../service/debug.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'bcz-debug-options',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [DebugService],
  templateUrl: './debug-options.component.html',
  styleUrl: './debug-options.component.scss'
})
export class DebugOptionsComponent {

  public _doDelay: boolean = DebugService.delayRequests;
  public _delayTime: number = DebugService.delayTime;
  public _aditionalLogs: boolean = DebugService.aditionalLogs;

  public constructor(
    private debugService: DebugService
  ) { }

  public setDelay() {
    this.debugService.setDelay(this._doDelay, this._delayTime);
  }
  public setAditionalLogs() {
    this.debugService.toggleAdditionalLogs(this._aditionalLogs);
  }

  public saveOptions() {
    this.setDelay();
    this.setAditionalLogs();
    this.debugService.save();
  }

  public handleDelayChange(ev: Event) {
    const element = (ev.currentTarget as HTMLInputElement);
    const value = element.checked;
    if (typeof value === 'boolean') {
      this._doDelay = value;
      this.setDelay();
    }
  }

  public handleDelayTimeChange(ev: Event) {
    const element = (ev.currentTarget as HTMLInputElement);
    const value = element.valueAsNumber;
    if (value) {
      this._delayTime = value;
      this.setDelay();
    }
  }

  public handleAdditionalLogChange(ev: Event) {
    const element = (ev.currentTarget as HTMLInputElement);
    const value = element.checked;
    if (typeof value === 'boolean') {
      this._aditionalLogs = value;
      this.setAditionalLogs();
    }
  }

}
