import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Campaign, Person } from './campaign';
import { CampaignService } from './campaign.service';

declare var Papa: any;

@Component({
    selector: 'campaign-editor',
    templateUrl: 'app/campaign-creator.component.html',
    styleUrls: ['app/campaign-creator.component.css']
})
export class CampaignEditorComponent implements OnInit { 
    contacts_block = '';
    spoof_block = '';
    campaign: Campaign = new Campaign();
    report: any;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private campaignService: CampaignService,
        private http: Http) {
            this.campaign.initialize();
    }
    ngOnInit(): void {
        this.route.params
            .switchMap((params: Params) => this.campaignService.getCampaign(params['id']))
            .subscribe(campaign => this.getProtoCampaign(campaign));
    }

    getProtoCampaign(campaign: Campaign): any {
        this.campaign = campaign;
        this.contacts_block = this.campaignService.unParseCsv(campaign.contacts);
        this.spoof_block = this.campaignService.unParseCsv(campaign.impersonate);
    }

    create(campaign: Campaign): Promise<string> {
        campaign.contacts = this.campaignService.parseCsv(this.contacts_block);
        campaign.impersonate = this.campaignService.parseCsv(this.spoof_block);
        return this.campaignService.update(campaign);
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
