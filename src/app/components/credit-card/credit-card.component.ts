import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { CreditCardPaymentFacade } from '../../store/facade';
import { currentDate } from '../../store/reducer';
import { PaymentService } from '../../services/payment.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css']
})
export class CreditCardComponent implements OnInit, OnDestroy {
  
  paymentForm!: FormGroup;
  errorMessage!: string;
  currentDate = new Date();
  currentMonth = new Date().getMonth() + 1;
  currentYear = new Date().getFullYear();
  unsubscribe$ = new Subject();

  constructor(private formBuilder: FormBuilder, private facade: CreditCardPaymentFacade) { }

  ngOnInit(): void {
    this.form();
    this.errorMessage = "Please Fill all fields";
  }

  form() {
    this.paymentForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      nameOnCard: ['', [Validators.required,Validators.minLength(1),Validators.pattern('^[A-Za-z][A-Za-z -]*$')]],
      cardNumber: ['', [Validators.required,Validators.minLength(16),Validators.min(1111111111111111),Validators.max(9999999999999999)]],
      expirationMonth: ['', [Validators.required,Validators.minLength(1),Validators.maxLength(2),Validators.min(this.currentMonth),Validators.max(12)]],
      expirationYear: ['', [Validators.required,Validators.minLength(4),Validators.maxLength(4),Validators.min(this.currentYear),Validators.max(9999)]],
      cardCVVNumber: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(3),Validators.min(111),Validators.max(999)]]
    });
  }

  get formControls() { return this.paymentForm.controls; }

  onSubmit() {
    this.submitForm();
   }
 
   submitForm() {
   if (this.paymentForm.status === 'VALID') {
     const expiryDate = new Date(this.paymentForm.get('expirationYear')?.value, this.paymentForm.get('expirationMonth')?.value, 1)
     const paymentFormData = {
       creditCardNumber: this.paymentForm.get('cardNumber')?.value.toString(),
       cardHolder: this.paymentForm.get('nameOnCard')?.value,
       expirationDate: expiryDate,
       securityCode: this.paymentForm.get('cardCVVNumber')?.value,
       amount: +this.paymentForm.get('amount')?.value,
     };
 
     this.facade.makePayment(paymentFormData);
    
   } else {
     this.errorMessage = "the Form is Invalid!";
   }
   }


   ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
