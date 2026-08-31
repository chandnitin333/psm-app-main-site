import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-custom-pagination',
  standalone: true,
  imports: [MatPaginator],
  templateUrl: './custom-pagination.component.html',
  styleUrls: ['./custom-pagination.component.css']
})
export class CustomPaginationComponent implements OnInit {
  @Input() length = 0;
  @Input() pageSize = 10;
  // @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
   @Input() pageSizeOptions: number[] = [10];
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Input() currentPage = 0;
  ngOnInit(): void {
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}
