import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { BillPaymentService } from '../../services/bill-payment.service';

@Component({
    selector: 'app-bill-pay',
    standalone: true,
    imports: [CommonModule, FormsModule, ToastrModule],
    templateUrl: './bill-pay.component.html',
    styleUrl: './bill-pay.component.css'
})
export class BillPayComponent {
    token: string = '';
    isLoading: boolean = true;
    notFound: boolean = false;
    billInfo: any = null;
    gharScannerUrl: string = '';
    paniScannerUrl: string = '';

    claim = {
        kar_type: 'gruhkar',
        payment_mode: 'upi',
        amount: null as number | null,
        utr_number: '',
        payer_name: '',
        payer_mobile: '',
        payer_remark: '',
    };
    transactionFile: File | null = null;
    transactionPreview: string | null = null;
    isSubmitting: boolean = false;
    submitted: boolean = false;
    payerLocked: boolean = false;

    // Fullscreen scanner preview (lightbox)
    previewScannerUrl: string | null = null;
    previewScannerTitle: string = '';

    constructor(
        private route: ActivatedRoute,
        private billPayment: BillPaymentService,
        private apiService: ApiService,
        private toastr: ToastrService,
    ) { }

    ngOnInit(): void {
        this.token = this.route.snapshot.paramMap.get('token') || '';
        if (!this.token) {
            this.notFound = true;
            this.isLoading = false;
            return;
        }
        this.loadBill();
    }

    loadBill(): void {
        this.billPayment.getPublicBill(this.token).subscribe({
            next: (res: any) => {
                this.isLoading = false;
                if (res?.status === 200 && res?.data) {
                    this.billInfo = res.data;
                    const p = this.billInfo?.panchayat;
                    if (p?.GHAR_TAX_SCANNER) {
                        this.gharScannerUrl = this.apiService.file_baseUrl + p.GHAR_TAX_SCANNER;
                    }
                    if (p?.PANI_TAX_SCANNER) {
                        this.paniScannerUrl = this.apiService.file_baseUrl + p.PANI_TAX_SCANNER;
                    }
                    // Prefill payer details from the current login session (JWT),
                    // if the link is opened in a logged-in browser. Readonly when prefilled.
                    const sessionUser = this.apiService.getDecodedToken();
                    if (sessionUser?.NAME) {
                        this.claim.payer_name = `${sessionUser.NAME ?? ''} ${sessionUser.SURNAME ?? ''}`.trim();
                        this.payerLocked = true;
                    }
                    // Point the form at a kar that is still open, and prefill its amount.
                    if (!this.isKarOpen(this.claim.kar_type as 'gruhkar' | 'panikar')) {
                        if (this.isKarOpen('gruhkar')) this.claim.kar_type = 'gruhkar';
                        else if (this.isKarOpen('panikar')) this.claim.kar_type = 'panikar';
                    }
                    this.onKarTypeChange();
                } else {
                    this.notFound = true;
                }
            },
            error: (err: any) => {
                console.error('Error loading bill:', err);
                this.isLoading = false;
                this.notFound = true;
            },
        });
    }

    onTransactionFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input?.files?.length) {
            this.transactionFile = null;
            this.transactionPreview = null;
            return;
        }
        this.transactionFile = input.files[0];
        const reader = new FileReader();
        reader.onload = () => this.transactionPreview = String(reader.result);
        reader.readAsDataURL(this.transactionFile);
    }

    onModeChange(): void {
        if (this.claim.payment_mode === 'cash') {
            this.transactionFile = null;
            this.transactionPreview = null;
            this.claim.utr_number = '';
        }
    }

    onKarTypeChange(): void {
        // Prefill the expected amount for the selected tax (still editable).
        const bill = this.billInfo?.bill;
        if (!bill) return;
        if (this.claim.kar_type === 'gruhkar' && bill.gruhkar_amount != null) {
            this.claim.amount = Number(bill.gruhkar_amount);
        } else if (this.claim.kar_type === 'panikar' && bill.pani_amount != null) {
            this.claim.amount = Number(bill.pani_amount);
        }
    }

    submitClaim(): void {
        if (!this.claim.amount) {
            this.toastr.error('कृपया रक्कम भरा', 'Error');
            return;
        }
        if (this.claim.payment_mode === 'upi') {
            if (!this.claim.utr_number) {
                this.toastr.error('UPI पेमेंटसाठी UTR क्रमांक आवश्यक आहे', 'Error');
                return;
            }
            if (!this.transactionFile) {
                this.toastr.error('UPI पेमेंटसाठी Transaction स्क्रीनशॉट अपलोड करा', 'Error');
                return;
            }
        }

        const formData = new FormData();
        formData.set('kar_type', this.claim.kar_type);
        formData.set('payment_mode', this.claim.payment_mode);
        formData.set('amount', String(this.claim.amount));
        if (this.claim.utr_number) formData.set('utr_number', this.claim.utr_number);
        if (this.claim.payer_name) formData.set('payer_name', this.claim.payer_name);
        if (this.claim.payer_mobile) formData.set('payer_mobile', this.claim.payer_mobile);
        if (this.claim.payer_remark) formData.set('payer_remark', this.claim.payer_remark);
        if (this.transactionFile) {
            formData.set('transaction_image', this.transactionFile, this.transactionFile.name);
        }

        this.isSubmitting = true;
        this.billPayment.claimPayment(this.token, formData).subscribe({
            next: (res: any) => {
                this.isSubmitting = false;
                if (res?.status === 201) {
                    this.toastr.success('पेमेंटची नोंद झाली. ग्रामपंचायत लवकरच पडताळणी करेल.', 'धन्यवाद');
                    // Reset the per-claim fields; loadBill() re-points the form at
                    // the remaining open kar (or hides it when both are done).
                    this.claim.amount = null;
                    this.claim.utr_number = '';
                    this.claim.payer_remark = '';
                    this.transactionFile = null;
                    this.transactionPreview = null;
                    this.loadBill();
                } else {
                    this.toastr.error(res?.message || 'नोंद होऊ शकली नाही', 'Error');
                }
            },
            error: (err: any) => {
                console.error('Error claiming payment:', err);
                this.isSubmitting = false;
                this.toastr.error('नोंद होऊ शकली नाही', 'Error');
            },
        });
    }

    txnImageUrl(filename: string): string {
        return this.apiService.file_baseUrl + filename;
    }

    modeLabel(mode: string): string {
        return mode === 'cash' ? 'रोख' : (mode === 'upi' ? 'UPI' : '—');
    }

    reportLabel(reportType: string): string {
        return reportType === '129-2' ? '१२९(२)' : '१२९(१)';
    }

    openScannerPreview(url: string, title: string): void {
        this.previewScannerUrl = url;
        this.previewScannerTitle = title;
    }

    closeScannerPreview(): void {
        this.previewScannerUrl = null;
        this.previewScannerTitle = '';
    }

    statusLabel(status: string): string {
        switch (status) {
            case 'verified': return 'पडताळले';
            case 'rejected': return 'नाकारले';
            default: return 'पडताळणी बाकी';
        }
    }

    /** Aggregate status per tax: verified > claimed > pending (no claim yet). */
    karStatus(karType: 'gruhkar' | 'panikar'): 'verified' | 'claimed' | 'pending' {
        const claims = (this.billInfo?.payments ?? []).filter((p: any) => p.kar_type === karType && p.status !== 'rejected');
        if (claims.some((p: any) => p.status === 'verified')) return 'verified';
        if (claims.some((p: any) => p.status === 'claimed')) return 'claimed';
        return 'pending';
    }

    /** A kar is open (form should accept entry) when it has no active claim. */
    isKarOpen(karType: 'gruhkar' | 'panikar'): boolean {
        return this.karStatus(karType) === 'pending';
    }

    /** Form stays visible while at least one kar is still pending. */
    get hasOpenKar(): boolean {
        return this.isKarOpen('gruhkar') || this.isKarOpen('panikar');
    }

    karStatusLabel(karType: 'gruhkar' | 'panikar'): string {
        switch (this.karStatus(karType)) {
            case 'verified': return 'भरले ✓';
            case 'claimed': return 'पडताळणी बाकी';
            default: return 'बाकी';
        }
    }
}
