import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Campaign, Person, Log } from './campaign';

declare var Papa: any;

@Injectable()
export class CampaignService {
    private updateUrl = 'api/update';
    private campaignListUrl = 'api/list';
    private createUrl = 'api/create';
    private campaignUrl = 'api/campaign';
    constructor(private http: Http) { }
    getCampaigns(): Promise<Campaign[]> {
        return this.http.get(this.campaignListUrl)
                .toPromise()
                .then(response => response.json().data as Campaign[])
                .catch(this.handleError);
    }
    getCampaign(id: string): Promise<Campaign> {
        console.log('getting campaign id ' + id);
        var body = JSON.stringify({id: id});
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });
        return this.http.post(this.campaignUrl, body, options)
                .toPromise()
                .then(response => response.json().data as Campaign)
                .catch(this.handleError);
    }
    update(campaign: Campaign): Promise<string> {
        var body = JSON.stringify(campaign);
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });
        return this.http.post(this.updateUrl, body, options)
                .toPromise()
                .then(response => response.json().id as string)
                .catch(this.handleError);
    }
    createCampaign(campaign: Campaign): Promise<string> {
        var body = JSON.stringify(campaign);
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });
        this.populateLog(campaign);
        return this.http.post(this.createUrl, body, options)
                .toPromise()
                .then(response => response.json().id as string)
                .catch(this.handleError);
    }
    populateLog(campaign: Campaign): void {
       campaign.log.forEach(l => l.user.selected=true);
       campaign.contacts.forEach(function(person: Person) {
           if(person.selected) {
               var l = new Log;
               l.user = person;
               l.calls = [];
               l.is_closed = false;
               campaign.log.push(l);
           }
       });
    }
  
    unParseCsv(pArray: any[]): string {
        return Papa.unparse(pArray);
    }

    parseCsv(csvstr: string): any {
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
                q[k.trim().toLowerCase()] = p[k].trim();
            });
            post.push(q);
        });
        return post;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
