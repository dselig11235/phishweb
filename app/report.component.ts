import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { CampaignService } from './campaign.service';
import { Campaign, Log, Person } from './campaign';
import { LogComponent } from './log.component';

import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'my-report',
    templateUrl: 'app/report.component.html',
    styleUrls: ['app/report.component.css']
})
export class ReportComponent implements OnInit {
    report: any[];
    constructor(
          private campaignService: CampaignService,
          private route: ActivatedRoute,
          private location: Location
    ) {}
    ngOnInit(): void {
        console.log('campaign-detail of ' + this.route.params['id']);
        console.log(this.route.params);
        this.route.params
            .switchMap((params: Params) => this.campaignService.getCampaign(params['id']))
            .subscribe(campaign => this.report = this.genReport(campaign));
    }
    genReport(campaign: Campaign): any[] {
        var report: any[] = [];
        campaign.log.filter(l => l.calls.length > 0).forEach(l => {
            var rlog: any = {};
            rlog.pretext = campaign.pretext;
            rlog.calls = [];
            [0, 1, 2].forEach(idx => {
                var rcall: any = {};
                if(l.calls.length > idx) {
                    var date_of_call = new Date(l.calls[idx].time)
                    rcall.time = (date_of_call.getMonth() + 1) + '/' 
                                + date_of_call.getDate() + '/' 
                                + date_of_call.getFullYear();
                } else {
                    rcall.time = '';
                }
                rlog.calls.push(rcall);
            })
            function formatPhone(s: string) {
                var s2 = (""+s).replace(/\D/g, '');
                var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
                return (!m) ? null : m[1] + "-" + m[2] + "-" + m[3];
            }

            rlog.user = {
                name: l.user.name,
                phone: formatPhone(l.user.phone),
                extension: l.user.extension ? l.user.extension : ''
            }
            var result = l.calls[l.calls.length-1].result;
            if(result === "failed") {
                rlog.result = 1;
            }
            if(result === "passed") {
                rlog.result = 2;
            }
            if(result === "vm") {
                rlog.result = 3;
            }
            var spoof_idx: number = l.calls[l.calls.length-1].spoofed;
            if(spoof_idx > -1) {
                rlog.spoofed = campaign.impersonate[spoof_idx].name;
            } else {
                rlog.spoofed = '???';
            }
            var call_notes = l.calls.map(c => c.notes).filter(n => n!= "");
            rlog.notes = l.calls.map(c => c.notes).filter(n => n != "").join('.  ');
            rlog.breached = '\n\n\n' + l.calls.map(c => c.breached).filter(n => n != "").join('\n');

            rlog.description = "The analyst called claiming to be "
                            + rlog.spoofed + " asking the user "
                            + rlog.pretext + ".  " + rlog.notes
                            + ".  The analyst thanked the user and ended the call.  "
                            + rlog.breached;
            rlog.description = rlog.description.replace(/\n/g, "\\n")
                                            .replace(/\.  \./g, ".  ");


            report.push(rlog);
        });
        return report;
    }
}
