import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialService } from '../shared/classes/material.service';
import { AnswersService } from '../shared/services/answers.service';
import { AuthService } from '../shared/services/auth.service';
import * as data from './questions.json';

@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.component.html',
  styleUrls: ['./quiz-page.component.css']
})
export class QuizPageComponent implements OnInit {

  form: FormGroup

  questionsList = data.results
  question = null
  answersId = null

  currentQuestion = null
  currentQuestionNumber = null
  currentQuestionArray = null

  authUser = null
  loading = false
  submitDisabled = null
  quizDoneNum = 9

  constructor(
    private answersService: AnswersService,
    private auth: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    this.form = new FormGroup({
      question: new FormControl(null, [Validators.required]),      
    })

    this.loading = true
    this.authUser = this.auth.getAuthUser()
    this.answersService.getAnswersByUserId(this.authUser.userId).subscribe(
      ({ answers, _id }) => {
        this.loading = false

        if(answers.length > this.quizDoneNum) {
          return this.quizDone()
        }

        this.answersId = _id
        this.currentQuestionNumber = answers.length + 1
        this.question = this.questionsList[answers.length]
        this.showQuestion()
      }
    )
  }

  quizDone() {
    MaterialService.toast('Quiz done!')
    return this.router.navigate(['/results'])    
  }

  showQuestion() {
    this.submitDisabled = true
    this.currentQuestionArray = [this.question.correct_answer, ...this.question.incorrect_answers].sort()
    this.currentQuestion = this.question.question    
  }

  enableSubmit() {
    this.submitDisabled = false
  }

  onSubmit() {
    this.loading = true
    const result = this.form.value.question === this.question.correct_answer ? 1 : 0
    this.answersService.update(this.answersId, result).subscribe(
      (newAnswers) => {
        if(newAnswers.answers.length > this.quizDoneNum) {
          return this.quizDone()
        }
        this.loading = false
        this.currentQuestionNumber++
        this.question = this.questionsList[newAnswers.answers.length + 1]
        this.showQuestion()
      }
    )    
  }
}
