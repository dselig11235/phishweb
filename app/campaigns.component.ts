import { Component, OnInit } from '@angular/core';
import { Campaign } from './campaign';
import { CampaignService } from './campaign.service';
import { Router } from '@angular/router';


@Component({
    selector: 'my-campaigns',
    template:`
        <h2>My Campaigns</h2>
        <ul class="campaigns">
            <li *ngFor="let campaign of campaigns" 
                (click)="onSelect(campaign)"
                [class.selected]="campaign === selectedCampaign">
                <span class="badge">{{campaign.id}}</span> {{campaign.name}}
            </li>
        </ul>
        <div *ngIf="selectedCampaign">
            <h2>
                {{selectedCampaign.name | uppercase}} is my campaign
            </h2>
            <button (click)="gotoDetail()">View Details</button>
        </div>

    `,
    styles: [`
        .selected {
            background-color: #CFD8DC !important;
            color: white;
        }
        .campaigns {
            margin: 0 0 2em 0;
            list-style-type: none;
            padding: 0;
            width: 15em;
        }
        .campaigns li {
            cursor: pointer;
            position: relative;
            left: 0;
            background-color: #EEE;
            margin: .5em;
            padding: .3em 0;
            height: 1.6em;
            border-radius: 4px;
        }
        .campaigns li.selected:hover {
            background-color: #BBD8DC !important;
            color: white;
        }
        .campaigns li:hover {
            color: #607D8B;
            background-color: #DDD;
            left: .1em;
        }
        .campaigns .text {
            position: relative;
            top: -3px;
        }
        .campaigns .badge {
            display: inline-block;
            font-size: small;
            color: white;
            padding: 0.8em 0.7em 0 0.7em;
            background-color: #607D8B;
            line-height: 1em;
            position: relative;
            left: -1px;
            top: -4px;
            height: 1.8em;
            margin-right: .8em;
            border-radius: 4px 0 0 4px;
        }
    `]
})
export class CampaignsComponent implements OnInit {
    constructor(
        private router: Router,
        private campaignService: CampaignService) { }
    title = 'Tour of Campaigns';
    campaigns: Campaign[];
    selectedCampaign: Campaign;
    onSelect(campaign: Campaign): void {
        this.selectedCampaign = campaign;
    }
    getCampaigns(): void {
        this.campaignService.getCampaigns().then(campaigns => this.campaigns = campaigns);
    }
    ngOnInit(): void {
        this.getCampaigns();
    }
    gotoDetail(): void {
        this.router.navigate(['/detail', this.selectedCampaign.id]);
    }

}
