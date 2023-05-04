import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  public userId!: number
  public userData!: User
  public loadSpinner: boolean = true;
  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.userId = params['id'];
      this.fetchUserDetails( this.userId);
    });
  }
  fetchUserDetails(userId: number) {
    this.api.getRegistereduserId(userId)
    .subscribe({
      next: (res) => {
        setTimeout(() => {
          this.loadSpinner = false;
        }, 1000);
        this.userData = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
