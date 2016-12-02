import { Component, OnInit } from '@angular/core';

import { Campaign } from './campaign';
import { CampaignService } from './campaign.service';
import { Router } from '@angular/router';


@Component({
    selector: 'my-dashboard',
    templateUrl: 'app/dashboard.component.html',
    styleUrls: ['app/dashboard.component.css']
})
export class DashboardComponent implements OnInit { 
    campaigns: Campaign[] = [];
    constructor(
        private router: Router,
        private campaignService: CampaignService) { }
    ngOnInit(): void {
        this.campaignService.getCampaigns()
            .then(campaigns => this.campaigns = campaigns);
    }
    gotoDetail(campaign: Campaign): void {
        console.log(Object.getOwnPropertyNames(campaign).join(', '));
        this.router.navigate(['/detail', campaign.id]);
    }
}
