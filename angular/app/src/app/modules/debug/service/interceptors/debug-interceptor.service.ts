import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { DebugService } from '../debug.service';

@Injectable()
export class DebugInterceptorService implements HttpInterceptor {

  constructor(
    private debugService: DebugService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (DebugService.delayRequests) {
      return next.handle(req).pipe(delay(DebugService.delayTime));
    }
    return next.handle(req);
  }

}
