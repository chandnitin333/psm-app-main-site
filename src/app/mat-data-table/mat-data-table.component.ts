import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';


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
    FormsModule
  ],
  templateUrl: './mat-data-table.component.html',
  styleUrl: './mat-data-table.component.css'
})
export class MatDataTableComponent {

  @Input() displayedColumns: string[] = []; @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort!: MatSort;
  @Input() totalItems!: number; 
  @Input() itemsPerPage = 10;
  ngOnInit(): void { this.dataSource.sort = this.sort; }
}
