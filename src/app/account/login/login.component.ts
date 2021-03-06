import { Component, OnInit } from '@angular/core';
import {LoginService} from '../services/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {User} from '../../models/user';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm:FormGroup;
    errMsg:string;

    constructor(private loginSrvc:LoginService, private router:Router) { 
        this.errMsg = '';
        this.loginForm = new FormGroup({
            email: new FormControl('', {validators: [
                Validators.required,
                Validators.email,
                Validators.minLength(8),
            ],updateOn: 'blur'}),
            password: new FormControl('', {validators: [
                Validators.minLength(8),
                Validators.required,
            ], updateOn: 'blur'})
        })
    }

    ngOnInit(): void {
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    clearForm(){
        this.loginForm.reset();
    }

    login(){
        let user:User = {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
        }

        this.loginSrvc.login(user).subscribe(
            (data) => {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('email', user.email);
                this.router.navigate(['/user']);

                localStorage.getItem('role') == 'admin' ? this.router.navigate(['/admin']) : this.router.navigate(['/user']);
            },
            (error) => {
                this.clearForm();
                this.errMsg = error.error.msg;
            }
        )
    }

}
