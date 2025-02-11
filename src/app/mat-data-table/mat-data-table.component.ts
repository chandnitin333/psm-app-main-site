import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from '../common-dialog/confirm-dialog.component';

@Component({
  selector: 'app-mat-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    MatTooltipModule
  ],
  templateUrl: './mat-data-table.component.html',
  styleUrl: './mat-data-table.component.css'
})
export class MatDataTableComponent {

  @Input() displayedColumns: { key: string, value: string }[] = [];
  @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort!: MatSort;
  @Input() totalItems!: number;
  @Input() itemsPerPage = 10;
  @Input() currentPage: number = 0;

  // Permissions
  @Input() isEdit: boolean = false;
  @Input() isDelete: boolean = false;
  @Input() isView: boolean = false;
  @Input() isPrint: boolean = false;
  @Input() isDownload: boolean = false;
  @Input() isPreview: boolean = false;
  @Input() isKar: boolean = false;

  // Output Events
  @Output() editEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() viewEvent = new EventEmitter<any>();
  @Output() printEvent = new EventEmitter<any>();
  @Output() downloadEvent = new EventEmitter<any>();
  @Output() previewEvent = new EventEmitter<any>();
  @Output() prevTaxEvent = new EventEmitter<any>(); // Magil kar 

  columnKeys: string[] = [];

  constructor(public dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.columnKeys = this.displayedColumns.map(c => c.key);
  }

  srNo(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }

  edit(element: any) {
    console.log("e;e", element)
    this.editEvent.emit(element);
  }

  view(element: any) {
    this.viewEvent.emit(element);
  }

  delete(element: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this item?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Deleted:', element);
        this.deleteEvent.emit(element);
      }
    });
  
  }

  print(element: any) {
    this.printEvent.emit(element);
  }

  downloadPDF(element: any) {
    this.downloadEvent.emit(element);
  }

  preview(element: any) {
    this.previewEvent.emit(element);
  }

  prevTax(element: any) {
    this.prevTaxEvent.emit(element);
  }
}
