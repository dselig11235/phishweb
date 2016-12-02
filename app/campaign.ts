export class Person {
    id: number;
    name: string;
    phone: string;
    extension: string;
    info: string;
    selected: boolean;
}

export class Call {
    time: Date;
    spoofed: number;
    result: string; // pass, fail, or vm
    notes: string;  // summary of conversation
    breached: string; // any information obtained

    initialize(): void {
        this.spoofed = -1;
        this.result = '';
        this.notes = '';
        this.breached = '';
    }
}

export class Log {
    calls: Call[];
    user: Person;
    is_closed: boolean;
    constructor() {
        this.calls = [];
        this.user = new Person;
        this.is_closed = false;
    }
    allNotes(): string {
        var notes = this.calls.map(c => c.notes).filter(n => n != "");
        var breached = this.calls.map(c => c.breached).filter(n => n != "");
        return notes.join('.  ') + '\n\n\n' + breached.join('\n');
    }
}

export class Campaign {
    id: string;
    name: string;
    company: string;
    numcalls: number;
    impersonate: Person[];
    pretext: string;
    open: string;
    close: string;
    tz: string;
    utc_offset: number;
    notes: string;
    contacts: Person[];
    log: Log[];

    initialize() : void {
        this.id = '';
        this.name = '';
        this.company = '';
        this.numcalls = 0;
        this.impersonate = [];
        this.pretext = '';
        this.open = '';
        this.close = '';
        this.tz = '';
        this.notes = '';
        this.contacts = [];
        this.log = [];
    }
}
