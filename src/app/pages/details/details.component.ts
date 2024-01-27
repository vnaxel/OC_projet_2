import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, finalize } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
    public olympics$!: Observable<Olympic[]>;
    public subscription: Subscription = new Subscription();

    public countryId: number = 0;
    public countryName: string = '';

    public numberOfParticipations: number = 0;
    public numberOfMedals: number = 0;
    public numberOfAtletes: number = 0;
    public country: Olympic | undefined;

    public chartData: any[] = [];
    public yScaleMax: number = 0;

    constructor(private OlympicService: OlympicService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit(): void {

        this.olympics$ = this.OlympicService.getOlympics();

        this.countryId = this.route.snapshot.params['id'];

        this.subscription = this.olympics$.subscribe(data => {
            const country = data.find(country => country.id == this.countryId);
            this.country = country;
            if (country) {

                this.countryName = country.country;

                this.numberOfParticipations = country.participations.length;

                this.numberOfMedals = country.participations
                    .map(participation => participation.medalsCount)
                    .reduce((acc, value) => acc + value, 0);

                this.numberOfAtletes = country.participations
                    .map(participation => participation.athleteCount)
                    .reduce((acc, value) => acc + value, 0);

                const medalsPerYear = country.participations
                    .map(participation => {
                        return {
                            name: participation.year.toFixed(),
                            value: participation.medalsCount
                        }
                    });

                this.yScaleMax = Math.max(...medalsPerYear.map(medal => medal.value))*2;
                this.chartData = [{ name: this.countryName, series: medalsPerYear }];
            }
        });
    }

    ngAfterViewInit(): void {
        if (this.countryName === '') {
            this.router.navigate(['/error'], { state: { error: { message: `Id: ${this.countryId} - Country not found`, name: '404' } } });
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
