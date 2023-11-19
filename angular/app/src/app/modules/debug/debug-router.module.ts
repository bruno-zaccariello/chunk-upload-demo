import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebugHomeComponent } from './components/debug-home/debug-home.component';

const routes: Routes = [
  { path: '', loadComponent: () => DebugHomeComponent }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebugRouterModule { }
