import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CampaignService } from './campaign.service';
import { Campaign, Log, Person } from './campaign';
import { LogComponent } from './log.component';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'my-campaign-detail',
    templateUrl: 'app/campaign-detail.component.html',
    styleUrls: ['app/campaign-detail.component.css']
})
export class CampaignDetailComponent implements OnInit {
    campaign: Campaign;
    clock = Observable.interval(1000).map(()=>this.utcAdjustedDate());
    user_chooser_active = false;
    utcAdjustedDate(): Date {
        var d = new Date();
        d.setHours(d.getHours() + 6 + this.campaign.utc_offset );
        return d;
    }
    constructor(
          private router: Router,
          private campaignService: CampaignService,
          private route: ActivatedRoute,
          private location: Location
    ) {}
    ngOnInit(): void {
        console.log('campaign-detail of ' + this.route.params['id']);
        console.log(this.route.params);
        this.route.params
            .switchMap((params: Params) => this.campaignService.getCampaign(params['id']))
            .subscribe(campaign => this.campaign = campaign);
    }
    getAllResults(): string [] {
        /*this.campaign.log.reduce(function(acc, cum) {
            console.log(cum);
        });
        */
        return this.campaign.log.reduce((results, log) => results.concat(log.calls.map(c => c.result)), [])
    }
    getStats(): any {
        var stats = {
            failed: 0, 
            passed: 0, 
            vm: 0
        }
        this.campaign.log.filter(log => {
            var results = log.calls.map(c => c.result);
            if(results.indexOf('failed') !== -1) {
                stats.failed += 1;
            } else if(results.indexOf('passed') !== -1) {
                stats.passed += 1;
            } else {
                stats.vm += results.length;
            }
        });
        return stats
    }

    getNumFailed(): number {
        //return this.getAllResults().reduce( (total, result) => result == "failed" ? total + 1 : total, 0);
        return this.getStats().failed;

    }
    getNumPassed(): number {
        //return this.getAllResults().reduce( (total, result) => result == "passed" ? total + 1 : total, 0);
        return this.getStats().passed;
    }
    getNumNoAnswer(): number {
        //return this.getAllResults().reduce( (total, result) => result == "vm" ? total + 1 : total, 0);
        return this.getStats().vm;
    }
    addRandomUser(): void {
        var unselected = this.campaign.contacts.filter(person => !person.selected);
        var user = unselected[Math.floor(Math.random()*unselected.length)];
        this.addUser(user);
    }
    selectUser(idx: number): void {
        this.addUser(this.campaign.contacts[idx]);
        this.user_chooser_active = false;
    }
    addUser(user: Person): void {
        var log = new Log;
        user.selected = true;
        log.user = user;
        log.calls = [];
        log.is_closed = false;
        this.campaign.log.push(log);
    }
    update(campaign: Campaign): Promise<string> {
        return this.campaignService.update(campaign);
    }
    getUnselected(): Person[] {
        return this.campaign.contacts.filter(person => !person.selected);
    }
    getReport(): void {
        this.router.navigate(['/report', this.campaign.id]);
    }
    showUserChooser(): void {
        this.user_chooser_active = !this.user_chooser_active;
    }
    editCampaignInfo(): void {
        this.router.navigate(['/edit', this.campaign.id]);
    }

}
