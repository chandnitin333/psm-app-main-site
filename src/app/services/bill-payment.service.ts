import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class BillPaymentService {
    constructor(private api: ApiService) { }

    generateLink(params: any) {
        return this.api.post('generate-bill-payment-link', params);
    }

    getPublicBill(token: string) {
        return this.api.get(`public/bill-pay/${token}`);
    }

    claimPayment(token: string, params: any) {
        return this.api.post(`public/bill-pay/${token}/claim`, params);
    }

    listPayments(params: any) {
        return this.api.post('bill-payments-list', params);
    }

    updateStatus(id: number, params: any) {
        return this.api.put(`bill-payment-status/${id}`, params);
    }

    karStatusByNewusers(newuserIds: number[], yearId?: any, reportType?: string) {
        return this.api.post('bill-kar-status', {
            newuser_ids: newuserIds,
            year_id: yearId ?? null,
            report_type: reportType ?? null,
        });
    }
}
