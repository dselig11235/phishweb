import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';
import { CampaignDetailComponent } from './campaign-detail.component';
import { CampaignsComponent } from './campaigns.component';
import { DashboardComponent } from './dashboard.component';
import { CampaignService }  from './campaign.service';
import { CampaignCreatorComponent} from './campaign-creator.component';
import { CampaignEditorComponent} from './campaign-editor.component';
import { LogComponent } from './log.component';
import { ReportComponent } from './report.component';

import { AppRoutingModule }   from './app-routing.module';
import { HttpModule } from '@angular/http';

@NgModule({
    imports:      [ 
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpModule
    ],
    declarations: [ 
        AppComponent,
        CampaignDetailComponent,
        CampaignsComponent,
        DashboardComponent,
        CampaignCreatorComponent,
        CampaignEditorComponent,
        ReportComponent,
        LogComponent
    ],
    providers: [
        CampaignService
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
