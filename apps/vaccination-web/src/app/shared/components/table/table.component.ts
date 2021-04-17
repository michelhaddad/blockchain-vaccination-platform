import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumnModel } from '../../models/table-column.model';
import { MatSort } from '@angular/material/sort';
import { TableButtonEnum } from 'src/app/modules/planning/components/models/planning-status.enum';

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
  @Output('buttonClicked') buttonClicked: EventEmitter<any> = new EventEmitter();
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
        item: element
      });

  }

  getButtonText(e: TableButtonEnum): string {
    switch (e) {
      case TableButtonEnum.RECEIVED:
        return 'Received';
      case TableButtonEnum.SENT:
        return 'Sent';
      case TableButtonEnum.REDEEM:
        return 'Redeem';
      case TableButtonEnum.ACCEPT:
        return 'Accept';
      case TableButtonEnum.SHIP:
        return 'Ship';
      default:
        return '';
    }
  }

  ngOnInit(): void { }
}
