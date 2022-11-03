import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {
  @Input() totalCount: number = 0;
  @Input() pageSize: number = 0;
  @Input() pageNumber: number = 0;
  @Output() pagerChanged = new EventEmitter<PageChangedEvent>();

  constructor() { }

  ngOnInit(): void {
  }

  onPagerChange(event: PageChangedEvent) {
    this.pagerChanged.emit(event);
  }

}
