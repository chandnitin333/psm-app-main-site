import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as QRCode from 'qrcode';
import { BillPaymentService } from '../../services/bill-payment.service';

/**
 * Renders a scannable QR code inside a printed magniche bill.
 * Scanning opens the public /bill-pay/<token> page (no login needed) where the
 * khatedar can pay and record the payment. Reused by report 129-1 and 129-2.
 */
@Component({
    selector: 'app-bill-qr',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="bill-qr-block" *ngIf="qrDataUrl">
            <img [src]="qrDataUrl" alt="Payment QR" class="bill-qr-img" />
            <div class="bill-qr-caption">
                <b>QR स्कॅन करून ऑनलाईन कर भरा</b><br />
                <span class="bill-qr-sub">घरकर व पाणी कर भरण्यासाठी मोबाईलने स्कॅन करा</span>
            </div>
        </div>
    `,
    styles: [`
        .bill-qr-block {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin: 2px 0;
        }
        .bill-qr-img {
            width: 64px;
            height: 64px;
            border: 1px solid #000;
            padding: 1px;
            background: #fff;
        }
        .bill-qr-caption {
            font-size: 10px;
            line-height: 1.3;
            text-align: left;
        }
        .bill-qr-sub {
            font-size: 9px;
        }
    `]
})
export class BillQrComponent implements OnInit {
    @Input() item: any;                       // itemRs3 row from the report
    @Input() wardNo: any;
    @Input() yearId: any;
    @Input() reportType: '129-1' | '129-2' = '129-1';

    qrDataUrl: string | null = null;

    constructor(private billPayment: BillPaymentService) { }

    ngOnInit(): void {
        const newuserId = this.item?.NEWUSER_ID;
        if (!newuserId) return;

        // Same amount split as the पेमेंट लिंक button:
        // पाणी कर = h (विशेष पाणी कर), गृहकर = b + d + e + f + g.
        const al = this.item?.rs4Data?.[0]?.alphabets ?? {};
        const gruhkarAmount =
            (al.b ?? 0) + (al.d ?? 0) + (al.e ?? 0) +
            (al.f ?? 0) + (al.g ?? 0);
        const paniAmount = (al.h ?? 0);
        const billData = {
            khatedar_name: this.item?.HOMEUSER_NAME,
            malmatta_number: this.item?.MALMATTA_NUMBER,
            annu_kramank: this.item?.ANNU_KRAMANK,
            total_amount: Math.round((gruhkarAmount + paniAmount) * 100) / 100,
            gruhkar_amount: Math.round(gruhkarAmount * 100) / 100,
            pani_amount: Math.round(paniAmount * 100) / 100,
        };

        this.billPayment.generateLink({
            newuser_id: newuserId,
            ward_no: this.item?.VARD_NUMBER ?? this.wardNo,
            year_id: this.yearId,
            report_type: this.reportType,
            bill_data: billData,
        }).subscribe({
            next: (res: any) => {
                if (res?.status === 201 && res?.token) {
                    const url = `${window.location.origin}/bill-pay/${res.token}`;
                    this.renderQr(url);
                }
            },
            error: (err: any) => console.error('bill-qr generateLink error:', err),
        });
    }

    private renderQr(url: string): void {
        QRCode.toDataURL(url, { width: 184, margin: 1, errorCorrectionLevel: 'M' })
            .then((dataUrl: string) => this.qrDataUrl = dataUrl)
            .catch((err: any) => console.error('bill-qr render error:', err));
    }
}
