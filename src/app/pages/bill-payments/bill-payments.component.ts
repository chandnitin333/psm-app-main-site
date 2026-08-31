import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LayoutModule } from '../../components/layout/layout.module';
import { ITEM_PER_PAGE } from '../../constants/common.constant';
import { CustomPaginationComponent } from '../../custom-pagination/custom-pagination.component';
import { ApiService } from '../../services/api.service';
import { BillPaymentService } from '../../services/bill-payment.service';
import Util from '../../utils/utils';

@Component({
    selector: 'app-bill-payments',
    standalone: true,
    imports: [LayoutModule, CommonModule, FormsModule, ToastrModule, CustomPaginationComponent],
    templateUrl: './bill-payments.component.html',
    styleUrl: './bill-payments.component.css'
})
export class BillPaymentsComponent {
    items: any[] = [];
    totalItems: number = 0;
    itemsPerPage: number = ITEM_PER_PAGE;
    currentPage: number = 1;
    statusFilter: string = '';
    selectedItem: any = null; // record shown in the details modal

    constructor(
        private billPayment: BillPaymentService,
        private apiService: ApiService,
        private toastr: ToastrService,
        private util: Util,
    ) { }

    ngOnInit(): void {
        this.fetchData();
    }

    fetchData(): void {
        this.billPayment.listPayments({
            page_number: this.currentPage,
            status: this.statusFilter || null,
        }).subscribe({
            next: (res: any) => {
                this.items = res?.data ?? [];
                this.totalItems = res?.totalRecords ?? 0;
            },
            error: (err: any) => {
                console.error('Error fetching bill payments:', err);
                this.toastr.error('पेमेंट यादी मिळू शकली नाही', 'Error');
            },
        });
    }

    onPageChange(event: PageEvent): void {
        this.currentPage = event.pageIndex + 1;
        this.fetchData();
    }

    onFilterChange(): void {
        this.currentPage = 1;
        this.fetchData();
    }

    setStatus(item: any, status: 'verified' | 'rejected'): void {
        const actionLabel = status === 'verified' ? 'पडताळणी' : 'नाकारणे';
        const confirmOptions = status === 'verified'
            ? {
                title: 'पेमेंट पडताळायचे आहे?',
                text: `${this.karLabel(item.kar_type)} — ₹${item.amount} ची नोंद पडताळली जाईल.`,
                confirmButtonText: 'होय, पडताळा',
                confirmButtonColor: '#16a34a',
                icon: 'question' as const,
            }
            : {
                title: 'पेमेंट नाकारायचे आहे?',
                text: `${this.karLabel(item.kar_type)} — ₹${item.amount} ची नोंद नाकारली जाईल.`,
                confirmButtonText: 'होय, नाकारा',
                confirmButtonColor: '#dc2626',
                icon: 'warning' as const,
            };
        this.util.showConfirmAlert(confirmOptions).then((ok) => {
            if (!ok) return;
            this.billPayment.updateStatus(item.id, { status }).subscribe({
                next: (res: any) => {
                    if (res?.status === 200) {
                        this.toastr.success(`${actionLabel} यशस्वी`, 'Success');
                        this.closeView();
                        this.fetchData();
                    } else {
                        this.toastr.error(res?.message || 'अपडेट होऊ शकले नाही', 'Error');
                    }
                },
                error: (err: any) => {
                    console.error('Error updating payment status:', err);
                    this.toastr.error('अपडेट होऊ शकले नाही', 'Error');
                },
            });
        });
    }

    txnImageUrl(filename: string): string {
        return this.apiService.file_baseUrl + filename;
    }

    openView(item: any): void {
        this.selectedItem = item;
    }

    closeView(): void {
        this.selectedItem = null;
    }

    karLabel(karType: string): string {
        return karType === 'gruhkar' ? 'घरकर' : 'पाणी कर';
    }

    reportLabel(reportType: string): string {
        return reportType === '129-2' ? '१२९(२)' : '१२९(१)';
    }

    modeLabel(mode: string): string {
        return mode === 'cash' ? 'रोख' : (mode === 'upi' ? 'UPI' : '—');
    }

    statusLabel(status: string): string {
        switch (status) {
            case 'verified': return 'पडताळले';
            case 'rejected': return 'नाकारले';
            default: return 'पडताळणी बाकी';
        }
    }

    srNo(index: number): number {
        return (this.currentPage - 1) * this.itemsPerPage + index + 1;
    }
}
