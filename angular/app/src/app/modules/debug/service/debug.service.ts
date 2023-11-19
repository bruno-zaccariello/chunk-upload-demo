import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DebugService {

  private static _delayRequests = false;
  private static _delayTime = 1000;
  private static _aditionalLogs = false;

  public static get delayRequests(): boolean {
    return DebugService._delayRequests;
  }

  public static get delayTime(): number {
    return DebugService._delayTime;
  }

  public static get aditionalLogs(): boolean {
    return DebugService._aditionalLogs;
  }

  constructor() {
    this.load();
  }

  public setDelay(value: boolean, ms: number = 1000) {
    DebugService._delayRequests = value;
    DebugService._delayTime = ms;
  }

  public toggleAdditionalLogs(on: boolean) {
    DebugService._aditionalLogs = on;
  }

  public save() {
    localStorage.setItem('debug', JSON.stringify({
      delayRequests: DebugService.delayRequests,
      delayTime: DebugService.delayTime,
      aditionalLogs: DebugService.aditionalLogs
    }));
  }

  public load() {
    const debug = localStorage.getItem('debug');
    if (debug) {
      const debugObj = JSON.parse(debug);
      this.setDelay(debugObj.delayRequests, debugObj.delayTime);
      this.toggleAdditionalLogs(debugObj.aditionalLogs);
    }
  }

}
