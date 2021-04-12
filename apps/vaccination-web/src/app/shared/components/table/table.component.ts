import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumnModel } from '../../models/table-column.model';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input('dataSource') dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @Input('displayedColumns') displayedColumns: TableColumnModel[] = [];
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @Output('actionClicked') actionClicked: EventEmitter<any> = new EventEmitter();
  @Output('menuClicked') menuClicked: EventEmitter<any> = new EventEmitter();
  constructor() { }

  getTableDisplayedColumnsIds(columns: TableColumnModel[]) {
    return columns.map(col => col.id);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  elementClicked(element: any, event: Event) {
    event.stopPropagation();
    if (element)
      this.actionClicked.emit({
        element: element
      });

  }

  openMenu(): void {

  }
  ngOnInit(): void { }
}
