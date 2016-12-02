import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { CampaignDetailComponent } from './campaign-detail.component';
import { ReportComponent } from './report.component';
import { CampaignsComponent } from './campaigns.component';
import { CampaignCreatorComponent } from './campaign-creator.component';
import { CampaignEditorComponent } from './campaign-editor.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard',  component: DashboardComponent },
    { path: 'detail/:id', component: CampaignDetailComponent },
    { path: 'report/:id', component: ReportComponent },
    { path: 'edit/:id', component: CampaignEditorComponent },
    { path: 'campaigns',     component: CampaignsComponent },
    { path: 'create',     component: CampaignCreatorComponent }
];
@NgModule({
    imports:      [ 
        RouterModule.forRoot(routes)
    ],
    exports: [ RouterModule ]
})
 export class AppRoutingModule {}
