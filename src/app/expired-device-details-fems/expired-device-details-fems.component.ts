import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DataService } from './../services/data.service';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { MatLegacyTable as MatTable } from '@angular/material/legacy-table';
import { AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { DataTableItem } from '../super-admin/data-table-datasource';

export class DialogData {

}
export interface UserData {
  aisles: string;
  Watt18: string;
  Watt20: string;
  Watt24: string;
  Watt36: string;
  Watt40: string;
  totalWattLoad: string;
  totalUnits: string;
  totalWatts: string;
}

@Component({
  selector: 'app-expired-device-details-fems',
  templateUrl: './expired-device-details-fems.component.html',
  styleUrls: ['./expired-device-details-fems.component.css']
})
export class ExpiredDeviceDetailsFemsComponent implements OnInit {
  dataSource: MatTableDataSource<UserData>;
  showExpiredDevices: boolean = false

  constructor(private dataService: DataService,
    public dialogRef: MatDialogRef<ExpiredDeviceDetailsFemsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.expiredDeviceslist()
  }
  displayedColumns = ['assetNo', 'deviceName', 'ModalNo', 'LocInWH', 'WarrentyTill', 'LastService', 'NextService'];

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChild(MatTable) table: MatTable<DataTableItem>;
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  expiredDeviceslist() {
    this.showExpiredDevices = true
    let data = { "site_id": parseInt(localStorage.getItem("siteId")) }
    this.dataService.expiredDeviceslist(data).subscribe(
      response => {
        console.log('response of snapshot', response)
        let inventoryData = []
        for (let i = 0; i <= response['data'].length - 1; i++) {
          let inventory = response['data'][i]

          inventoryData.push({
            "deviceName": inventory['deviceName'],
            "assetNo": inventory["assetNo"],
            "modelno": inventory["modelsNo"],
            "location": inventory["location"],
            "warrenty": inventory["warrentDate"],
            "last_service": inventory["last_serviceDate"],
            "next_service": inventory["next_serviceDate"],
            "id": inventory["id"]
          })
        }
        this.dataSource = new MatTableDataSource(inventoryData);
        this.dataSource.paginator = this.paginator.toArray()[0];

      }
    )

  }

}

