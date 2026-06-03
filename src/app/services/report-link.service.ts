import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ReportLinkService {
    constructor(private api: ApiService) { }

    generateLink(params: { newuser_id: any, report_key: string }) {
        return this.api.post('generate-report-link', params);
    }

    getPublicReport(token: string) {
        return this.api.get(`public/report/${token}`);
    }
}
