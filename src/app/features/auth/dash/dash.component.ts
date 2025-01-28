import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss'
})
export class DashComponent {
  constructor(private router: Router) {}

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
}
