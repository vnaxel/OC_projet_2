import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {
    public olympics$: Observable<any> = of(null);

    constructor(private olympicService: OlympicService) {}
  
    ngOnInit(): void {
      this.olympics$ = this.olympicService.getOlympics();
    }
}
