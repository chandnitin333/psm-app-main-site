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
                    // When opened via QR scan (no login), prefill the khatedar's own
                    // name from the bill (editable).
                    const sessionUser = this.apiService.getDecodedToken();
                    if (sessionUser?.NAME) {
                        this.claim.payer_name = `${sessionUser.NAME ?? ''} ${sessionUser.SURNAME ?? ''}`.trim();
                        this.payerLocked = true;
                    } else if (!this.claim.payer_name && this.billInfo?.bill?.khatedar_name) {
                        this.claim.payer_name = this.billInfo.bill.khatedar_name;
                        this.payerLocked = false;
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

    /** Above ₹2000 the QR scanner is replaced by bank/UPI details for that tax. */
    readonly BANK_THRESHOLD = 2000;

    useBankFor(karType: 'gruhkar' | 'panikar'): boolean {
        const amt = karType === 'gruhkar'
            ? Number(this.billInfo?.bill?.gruhkar_amount)
            : Number(this.billInfo?.bill?.pani_amount);
        return Number.isFinite(amt) && amt > this.BANK_THRESHOLD;
    }

    bankDetails(karType: 'gruhkar' | 'panikar'): any {
        const p = this.billInfo?.panchayat ?? {};
        if (karType === 'gruhkar') {
            return {
                bank_name: p.GHAR_BANK_NAME, ifsc: p.GHAR_IFSC,
                account_no: p.GHAR_ACCOUNT_NO, holder: p.GHAR_ACCOUNT_HOLDER, upi: p.GHAR_UPI_ID,
            };
        }
        return {
            bank_name: p.PANI_BANK_NAME, ifsc: p.PANI_IFSC,
            account_no: p.PANI_ACCOUNT_NO, holder: p.PANI_ACCOUNT_HOLDER, upi: p.PANI_UPI_ID,
        };
    }

    hasBankDetails(karType: 'gruhkar' | 'panikar'): boolean {
        const b = this.bankDetails(karType);
        return !!(b.bank_name || b.account_no || b.upi);
    }

    /** UPI ID configured for this tax? (needed for the GPay/PhonePe button) */
    upiAvailable(karType: 'gruhkar' | 'panikar'): boolean {
        return !!this.bankDetails(karType).upi;
    }

    /**
     * Open the UPI app chooser (GPay / PhonePe / Paytm ...) with the
     * panchayat's UPI ID and the amount prefilled.
     */
    payViaUpi(karType: 'gruhkar' | 'panikar'): void {
        const b = this.bankDetails(karType);
        if (!b.upi) return;
        const amt = karType === 'gruhkar'
            ? Number(this.billInfo?.bill?.gruhkar_amount)
            : Number(this.billInfo?.bill?.pani_amount);
        const payeeName = b.holder || this.billInfo?.panchayat?.PANCHAYAT_NAME || 'Gram Panchayat';
        const note = (karType === 'gruhkar' ? 'Gharkar' : 'Panikar')
            + (this.billInfo?.bill?.malmatta_number ? ` M.No ${this.billInfo.bill.malmatta_number}` : '');
        const params = new URLSearchParams();
        params.set('pa', b.upi);
        params.set('pn', payeeName);
        if (Number.isFinite(amt) && amt > 0) {
            params.set('am', amt.toFixed(2));
        }
        params.set('cu', 'INR');
        params.set('tn', note);
        // window.location bypasses Angular's href sanitizer for the upi: scheme.
        window.location.href = `upi://pay?${params.toString()}`;
    }

    /** Download the scanner QR image so the user can pay via
     *  GPay/PhonePe "upload QR from gallery". */
    downloadScanner(url: string, karLabel: string): void {
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                const ext = (blob.type.split('/')[1] || 'png').replace('jpeg', 'jpg');
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `${karLabel}-scanner.${ext}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href);
                this.toastr.success('स्कॅनर डाउनलोड झाला. UPI ॲपमध्ये "Upload QR" ने भरणा करा.', 'यशस्वी');
            })
            .catch(() => {
                // Fallback: open in new tab so user can long-press & save.
                window.open(url, '_blank');
            });
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
