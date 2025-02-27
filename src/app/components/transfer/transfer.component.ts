import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-transfer',
  standalone: false,
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent implements OnInit{

  transactionForm: any = FormGroup;

  constructor(private fb: FormBuilder) { }


  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      paymentMethod: new FormControl('user account number'),
      transactionType: new FormControl('Add money'),
      amount: new FormControl('$')
    });
  }
}
