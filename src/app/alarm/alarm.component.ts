import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: any;
  dataSource: any;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;

  }

  constructor() { }

  ngOnInit() {
    this.displayedColumns = ['custname', 'totalproperty', 'sensorbypass', 'powertheft', 'internetdown'];
  }

}
export interface PeriodicElement {
  custname: string;
  totalproperty: string;
  sensorbypass: string;
  powertheft: string;
  internetdown: string;
}
