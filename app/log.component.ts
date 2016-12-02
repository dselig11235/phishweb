import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { CampaignService } from './campaign.service';
import { Log, Person, Call, Campaign } from './campaign';

import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'my-log',
    templateUrl: 'app/log.component.html',
    styleUrls: ['app/log.component.css']
})
export class LogComponent implements OnInit {
    @Input() campaign: Campaign;
    @Input() log: Log;
    impersonate: Person [];
    newCall: Call = new Call;
    constructor(
    ) {}
    ngOnInit(): void {
        this.newCall.initialize();
        this.impersonate = this.campaign.impersonate;
        console.log('impersonating')
        console.log(this.impersonate);
    }
    saveResult(result: string) {
        this.newCall['time'] = new Date();
        this.newCall.result = result;
        this.log.calls.push(JSON.parse(JSON.stringify(this.newCall)));
        this.newCall.initialize();
        var calls = this.log.calls;
        if(calls.length >= 3 || result != "vm") {
            this.log.is_closed = true;
        }
    }
    removeCall(call: Call) {
        var idx = this.log.calls.indexOf(call);
        if(idx > -1) {
            this.log.calls.splice(idx, 1);
        }
    }
    tzAdjustedTime(call: Call): Date {
        var d = new Date(call.time);
        d.setHours(d.getHours() + 6 + this.campaign.utc_offset);
        return d;
    }
}
