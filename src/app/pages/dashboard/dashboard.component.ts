import { Component } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Country } from 'src/app/core/models/Country';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {
    public olympics$!: Observable<Olympic[]>;
    public subscription: Subscription = new Subscription();
    public OlympicData: Olympic[] = [];
    public OlympicGamesCount: number = 0;
    public CountriesCount: number = 0;
    public chartData: Country[] = [];
    public legendPositionResponsive: LegendPosition = LegendPosition.Below;

    constructor(private olympicService: OlympicService, private router: Router) { }

    ngOnInit(): void {
        this.olympics$ = this.olympicService.getOlympics();

        this.subscription = this.olympics$.subscribe(data => {

            this.OlympicData = data;
            this.CountriesCount = this.OlympicData.length;

            this.OlympicGamesCount = this.OlympicData
                .map(country => country.participations)
                .flat()
                .map(olympicGame => olympicGame.id)
                .filter((value, index, self) => self.indexOf(value) === index)
                .length;


            this.chartData = this.OlympicData
                .map(country => {
                    return {
                        extra: {
                            id: country.id,
                        },
                        name: country.country,
                        value: country.participations
                            .map(participation => participation.medalsCount)
                            .reduce((acc, value) => acc + value, 0)
                    }
                });
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    customTooltipText({ data }: { data: Country }): string {
        return `${data.name}<br>🏅${data.value}`;
    }

    customLabelText(name: string): string {
        return `  ${name}  `;
    }

    onSelect(event: Country | string) {
        if (typeof event === 'string') {
            const id = this.OlympicData.find(country => country.country === event)?.id;
            this.router.navigate([`/details/${id}`]);
        } else {
            this.router.navigate([`/details/${event.extra.id}`]);
        }
    }
}
