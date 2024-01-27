import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss'
})
export class ErrorComponent {
    public error: Error = new Error();
    constructor(private router: Router) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation) {
            const state = navigation.extras.state as { error: { message: string, name: string } };
            this.error = new Error(state.error.message);
            this.error.name = state.error.name;
        }
    }
}
