import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthLayoutComponent} from "./shared/layouts/auth-layout/auth-layout.component";
import {AuthGuard} from "./shared/classes/auth.guard";
import { ResultsPageComponent } from './results-page/results-page.component';
import { QuizPageComponent } from './quiz-page/quiz-page.component';

const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: '/results', pathMatch: 'full'},
      {path: 'results', component: ResultsPageComponent},
      {path: 'quiz', component: QuizPageComponent, canActivate: [AuthGuard]},
      {path: '**', redirectTo: '/results'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
