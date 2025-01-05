import { Component, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CustomPaginationComponent } from '../../custom-pagination/custom-pagination.component';
import { MatDataTableComponent } from '../../mat-data-table/mat-data-table.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatDataTableComponent, CustomPaginationComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  displayedColumns: string[] = ['id', 'name', 'age'];
  dataSource = new MatTableDataSource([{ id: 1, name: 'John Doe', age: 28 }, { id: 2, name: 'Jane Smith', age: 34 }, { id: 3, name: 'Michael Brown', age: 45 }, { id: 4, name: 'Emily Johnson', age: 22 }, { id: 5, name: 'David Wilson', age: 30 }, { id: 6, name: 'Sarah Miller', age: 27 }, { id: 7, name: 'James Taylor', age: 31 }, { id: 8, name: 'Linda Anderson', age: 29 }, { id: 9, name: 'Robert Thomas', age: 50 }, { id: 10, name: 'Patricia Moore', age: 33 }, { id: 11, name: 'Charles Jackson', age: 40 }, { id: 12, name: 'Jennifer White', age: 37 }, { id: 13, name: 'Joseph Harris', age: 41 }, { id: 14, name: 'Elizabeth Martin', age: 26 }, { id: 15, name: 'Christopher Lee', age: 35 }, { id: 16, name: 'Susan Walker', age: 38 }, { id: 17, name: 'Daniel Hall', age: 32 }, { id: 18, name: 'Jessica Allen', age: 25 }, { id: 19, name: 'Paul Young', age: 46 }, { id: 20, name: 'Laura Hernandez', age: 24 }]);
  @Input() totalItems!: number;
  @Input() itemsPerPage = 10;
  pagedDataSource = new MatTableDataSource<any>([]);
  currentPage: number = 0;

  ngOnInit(): void {
    this.setPageData({ pageIndex: 0, pageSize: 10, length: this.dataSource.data.length });
  }
  onPageChange(event: PageEvent): void {

    this.currentPage = event.pageIndex
    this.setPageData(event);
  }


  setPageData(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedDataSource.data = this.dataSource.data.slice(startIndex, endIndex);
  }

}
