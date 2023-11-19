import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebugRouterModule } from './debug-router.module';
import { DebugHomeComponent } from './components/debug-home/debug-home.component';
import { DebugService } from './service/debug.service';
import { DebugInterceptorService } from './service/interceptors/debug-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DebugRouterModule,
    DebugHomeComponent
  ],
  providers: [
    DebugService, 
    DebugInterceptorService,
    { provide: HTTP_INTERCEPTORS, useClass: DebugInterceptorService, multi: true }
  ]
})
export class DebugModule { }
