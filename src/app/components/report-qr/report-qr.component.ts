import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as QRCode from 'qrcode';
import { ReportLinkService } from '../../services/report-link.service';

/**
 * Small QR printed on a report. Scanning opens the public read-only view of
 * that report at /public-report/<report_key>/<token> — no login required.
 * Reusable across reports (namuna-8-1 first; add report keys backend-side).
 */
@Component({
    selector: 'app-report-qr',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="report-qr-block" *ngIf="qrDataUrl">
            <img [src]="qrDataUrl" alt="Report QR" class="report-qr-img" />
            <span class="report-qr-caption">रिपोर्ट पाहण्यासाठी स्कॅन करा</span>
        </div>
    `,
    styles: [`
        .report-qr-block {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
        }
        .report-qr-img {
            width: 58px;
            height: 58px;
            border: 1px solid #000;
            padding: 1px;
            background: #fff;
        }
        .report-qr-caption {
            font-size: 8px;
            line-height: 1.2;
            text-align: center;
        }
        @media print {
            .report-qr-img { width: 50px !important; height: 50px !important; }
            .report-qr-caption { font-size: 7px !important; }
        }
    `]
})
export class ReportQrComponent implements OnInit {
    @Input() newuserId: any;
    @Input() reportKey: string = 'namuna-8-1';
    /** For ward/range reports — the request params identifying the report. */
    @Input() reportParams: any = null;
    /** Set false on public pages (no auth there to generate links). */
    @Input() enabled: boolean = true;
    /** Pre-built public URL (e.g. from a bulk token call). When set, the QR is
     *  rendered directly from it — no per-component generate-link request. */
    @Input() directUrl: string | null = null;

    qrDataUrl: string | null = null;

    constructor(private reportLink: ReportLinkService) { }

    ngOnInit(): void {
        // Fast path: caller already has the link (bulk-generated) — just render.
        if (this.directUrl) {
            this.renderQr(this.directUrl);
            return;
        }
        if (!this.enabled || (!this.newuserId && !this.reportParams)) return;
        this.reportLink.generateLink({
            newuser_id: this.newuserId ?? null,
            report_key: this.reportKey,
            report_params: this.reportParams ?? null,
        }).subscribe({
            next: (res: any) => {
                if (res?.status === 201 && res?.token) {
                    const url = `${window.location.origin}/public-report/${this.reportKey}/${res.token}`;
                    this.renderQr(url);
                }
            },
            error: (err: any) => console.error('report-qr generateLink error:', err),
        });
    }

    private renderQr(url: string): void {
        QRCode.toDataURL(url, { width: 168, margin: 1, errorCorrectionLevel: 'M' })
            .then((dataUrl: string) => this.qrDataUrl = dataUrl)
            .catch((err: any) => console.error('report-qr render error:', err));
    }
}
