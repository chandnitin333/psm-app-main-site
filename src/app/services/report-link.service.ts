import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ReportLinkService {
    constructor(private api: ApiService) { }

    generateLink(params: { newuser_id?: any, report_key: string, report_params?: any }) {
        return this.api.post('generate-report-link', params);
    }

    /** One call to create per-record links for many new_user_ids of the same
     *  param report (e.g. one QR per row of a ward list). Returns { tokens }. */
    generateLinksBulk(params: { report_key: string, report_params: any, new_user_ids: any[] }) {
        return this.api.post('generate-report-links-bulk', params);
    }

    getPublicReport(token: string) {
        return this.api.get(`public/report/${token}`);
    }
}
