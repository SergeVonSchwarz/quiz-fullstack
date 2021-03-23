import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, DoCheck } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import { Subscription } from 'rxjs';
import { MaterialService, MaterialInstance } from '../../classes/material.service';
import { AnswersService } from '../../services/answers.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css']
})
export class AuthLayoutComponent implements AfterViewInit, OnDestroy {

  form: FormGroup
  aSub: Subscription
  bSub: Subscription
  cSub: Subscription

  modal: MaterialInstance
  answersLength = 10
  quizButton = false
  isAuth = false 
  authStatus = false
  loading = false

  @ViewChild('modal') modalRef: ElementRef

  constructor(
    private auth: AuthService, 
    private router: Router,
    private route: ActivatedRoute,
    private answersService: AnswersService,
    ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(5)])
    })  

    this.route.queryParams.subscribe((params: Params) => {
      if(params['accessDenied']) {
        MaterialService.toast('Access denied!')
        MaterialService.toast('Log in!')
      } else if(params['sessionFailed']) {
        MaterialService.toast('Session failed!')
        MaterialService.toast('Log in!')
      }
    })  
  }

  ngDoCheck() {
    if(this.auth.isAuthenticated()) {
      this.isAuth = true
    }
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }  
  
  ngOnDestroy() {
    this.modal.destroy()
    if(this.aSub) this.aSub.unsubscribe()
    if(this.bSub) this.bSub.unsubscribe()
    if(this.cSub) this.cSub.unsubscribe()
  }

  showModal(result) {
    if(result === 'auth') {
      this.authStatus = true
    } else {
      this.authStatus = false
    }
    this.form.reset({email: null, password: null})
    this.modal.open()
    this.form.enable()
    MaterialService.updateTextFields()
  }

  closeModal() {
    this.modal.close()
  }

  logout(event: Event) {
    event.preventDefault()    
    this.auth.logout()
    this.isAuth = false  
    this.quizButton = false
    this.router.navigate(['/results']);  
  }

  onSubmit() {
    this.form.disable()

    if(!this.authStatus) {
      this.aSub = this.auth.login(this.form.value).subscribe(
        () => { 
          MaterialService.toast('You logged in!')
          this.isAuth = true
          this.modal.close()
          this.checkUser()
        },
        (error) => {
          MaterialService.toast(error.error.message)
          this.form.enable()
        },
        () => {
          this.authStatus = false
        }
      )
    } else {
      this.aSub = this.auth.register(this.form.value).subscribe(
        () => {
          MaterialService.toast('Registered!')
          MaterialService.toast('Log in!')
          this.modal.close()
        },
        (error) => {
          MaterialService.toast(error.error.message)
          this.form.enable()
        },
        () => {
          this.authStatus = false
        }
      )
    }
    
  }

  startQuiz() {
    this.bSub = this.answersService.create().subscribe(() => {
      this.quizButton = false
      this.router.navigate(['/quiz'])
    }),
    (error) => {
      this.quizButton = false
      MaterialService.toast(error.error.message)
    }
  }

  checkUser() {
    this.loading = true
    const authUser = this.auth.getAuthUser()  
    
    this.cSub = this.answersService.getAnswersByUserId(authUser.userId).subscribe(
      (data) => {     
        this.loading = false
        if(!data) {
          // answers not exist
          this.quizButton = true          
        } else {
          // answers exist
          if(data.answers.length >= this.answersLength) {
            // quiz done
            MaterialService.toast('Quiz done')
          } else {
            // quiz not done
            MaterialService.toast('Quiz not done')
            this.router.navigate(['/quiz'])
          }
        }
      }),
      (error) => { 
        MaterialService.toast(error.error.message)        
      }
  }
}
