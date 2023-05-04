import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faTextHeight } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown19 } from '@fortawesome/free-solid-svg-icons';
import { faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss'],
})
export class CreateRegistrationComponent implements OnInit {
  public faTextHeight = faTextHeight;
  public faCheck = faCheck;
  public faArrowDown19 = faArrowDown19;
  public faMobileScreen = faMobileScreen;
  public faEnvelope = faEnvelope;

  public packages = ['Monthly', 'Quarterly', 'Yearly'];
  public genders = ['Male', 'Female'];
  public importanList: string[] = [
    'Toxic Fat Reduction',
    'Energy and Endurance',
    'Building Lean Muscles',
    'Healthier Digestive System',
    'Sugar Craving Body',
    'Fitness',
  ];

  public registerForm!: FormGroup;

  public userIdToUpdate!: number;

  public isUpdateActive: boolean = false;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private toast: NgToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      didGymBefore: [''],
      enquiryDate: [''],
    });

    this.registerForm.controls['height'].valueChanges.subscribe((res) => {
      this.calculateBmi(res);
    });

    this.activatedRoute.params.subscribe((params) => {
      this.userIdToUpdate = params['id'];
      this.api.getRegistereduserId(this.userIdToUpdate).subscribe((res) => {
        this.isUpdateActive = true;
        this.fillFormToUpdate(res);
      });
    });
  }

  submit() {
    this.api.registerUser(this.registerForm.value).subscribe((res) => {
      this.toast.success({
        detail: 'Successfully Registered!',
        summary: 'Enquiry has been added successfully!',
        duration: 3000,
      });
      this.registerForm.reset();
    });
  }

  update() {
    this.api
      .updateRegisteredUsers(this.registerForm.value, this.userIdToUpdate)
      .subscribe((res) => {
        this.toast.success({
          detail: 'Successfully Updated!',
          summary: 'Enquiry has been updated successfully!',
          duration: 3000,
        });
        this.registerForm.reset();
        this.router.navigate(['list']) 
      });
  }

  calculateBmi(heightValue: number) {
    const weight = this.registerForm.value.weight;
    const height = heightValue;
    const bmi = weight / (height * weight);
    this.registerForm.controls['bmi'].patchValue(bmi);
    switch (true) {
      case bmi < 18.5:
        this.registerForm.controls['bmiResult'].patchValue('Underweight');

        break;

      case bmi >= 18.5 && bmi < 25:
        this.registerForm.controls['bmiResult'].patchValue('Normal');

        break;

      case bmi >= 18.5 && bmi < 30:
        this.registerForm.controls['bmiResult'].patchValue('Overweight');

        break;

      default:
        this.registerForm.controls['bmiResult'].patchValue('Obese');
        break;
    }
  }

  fillFormToUpdate(user: User) {
    this.registerForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      didGymBefore: user.didGymBefore,
      enquiryDate: user.enquiryDate,
    });
  }
}
