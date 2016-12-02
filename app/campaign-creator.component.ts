import { Component, OnInit } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Campaign, Person } from './campaign';
import { CampaignService } from './campaign.service';

declare var Papa: any;

@Component({
    selector: 'campaign-creator',
    templateUrl: 'app/campaign-creator.component.html',
    styleUrls: ['app/campaign-creator.component.css']
})
export class CampaignCreatorComponent { 
    contacts_block = '';
    spoof_block = '';
    campaign: Campaign = new Campaign();
    constructor(
        private campaignService: CampaignService,
        private http: Http) {
            this.campaign.initialize();
    }
    parseCsv(csvstr: string) {
        var pre: Person[] = Papa.parse(csvstr, {
            header: true,
            //dynamicTyping: true,
            skipEmptyLines: true
        }).data;

        console.log('got csv data');
        var post: Person[] = [];
        pre.forEach(function(p) {
            var q = new Person;
            Object.keys(p).forEach(function(k) {
                console.log('parsing csv for person ' + p.name + ' key ' + k);
                q[k.trim().toLowerCase()] = p[k].trim();
            });
            post.push(q);
        });
        return post;
    }
    create(campaign: Campaign): Promise<string> {
        campaign.contacts = this.campaignService.parseCsv(this.contacts_block);
        campaign.impersonate = this.campaignService.parseCsv(this.spoof_block);
        return this.campaignService.createCampaign(campaign);
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
