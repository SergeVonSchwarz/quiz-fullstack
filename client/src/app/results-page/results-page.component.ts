import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from '../shared/classes/material.service';
import { AnswersService } from '../shared/services/answers.service'
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.css']
})
export class ResultsPageComponent implements OnInit, OnDestroy, DoCheck {

  aSub: Subscription
  answersLength = 10
  answers = null
  loading = null
  loginUser = null

  constructor(
    private answersService: AnswersService,
    private auth: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    // antinavigate from /quiz to /results
    if(this.auth.isAuthenticated()) {
      this.loading = true
      const authUser = this.auth.getAuthUser()
      if(authUser) {
        this.aSub = this.answersService.getAnswersByUserId(authUser.userId).subscribe(
          (data) => {     
            this.loading = false
            if(data && data.answers.length < this.answersLength) {
                MaterialService.toast('Quiz not done')
                return this.router.navigate(['/quiz'])         
            }     
            return this.showResults(authUser.email) 
          }),
          (error) => { 
            this.loading = false
            MaterialService.toast(error.error.message)        
          }
      }
    }
    return this.showResults()       
  }

  showResults(user = '') {
    this.loginUser = user
    this.loading = true
    this.answersService.fetch().subscribe((data) => {
      this.loading = false
      data.sort(
        (a, b) => 
          (a.answers.reduce((sum, i) => sum += i, 0)) < (b.answers.reduce((sum, i) => sum += i, 0)) ? 1 : -1
      )
      this.answers = data      
    })
  }

  getSum(answers: Array<number>): number {
    return answers.reduce((sum, item) => sum += item, 0)
  } 

  ngDoCheck() {
    if(!this.auth.isAuthenticated()) {
      this.loginUser = ''
    }
  }

  ngOnDestroy() {
    if(this.aSub) this.aSub.unsubscribe()
  }
  
}
