import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DetailsComponent } from './pages/details/details.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
    },
    {
        path: '**', // wildcard
        component: NotFoundComponent,
    },
    {
        path: 'details/:id',
        component: DetailsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
