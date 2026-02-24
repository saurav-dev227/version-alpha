import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserData } from './../customer-dashboard/customer-dashboard.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { FemsDialogComponent } from '../fems-dialog/fems-dialog.component';
import { AddDeviceDialogComponent } from '../add-device-dialog/add-device-dialog.component'
import { AddDevtypeDialogComponent } from '../add-devtype-dialog/add-devtype-dialog.component';

import { Router } from '@angular/router';
import { DataService } from './../services/data.service';
import { AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { DeviceDetailsFemsComponent } from '../device-details-fems/device-details-fems.component';
import { ExpiredDeviceDetailsFemsComponent } from '../expired-device-details-fems/expired-device-details-fems.component';


export interface femsData {
  data: any;
  deviceCat: any;
}
export interface devTypeData {
  data2: any;

}
export interface DialogData {
  device_id: string;
  dev_category: string;
  deviceCat: string;
  data1: string

}

@Component({
  selector: 'app-fems',
  templateUrl: './fems.component.html',
  styleUrls: ['./fems.component.css']
})

export class FemsComponent implements OnInit {

  devName: string;
  deviceCat: string;
  totalDevices: any;
  warrenty: any;
  expiry: any;
  constructor(public dialog: MatDialog, private router: Router, private DataService: DataService,) {


  }

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  femsDataSource: MatTableDataSource<femsData>;
  displayedColumns: string[] = ['serialNo', 'assetNo', 'deviceName', 'updatedBy', 'LocInWH', 'WarrentyTill', 'LastService', 'NextService', 'ModalNo', 'actions'];

  // femsAddDevTypeDataSource: MatTableDataSource<femsData>;
  femsAddDevTypeDataSource: MatTableDataSource<devTypeData>;
  displayedColumns2: string[] = ['serialNo', 'devName', 'deviceCat', 'actions'];
  showDevList;
  data: any;
  myObj = JSON.parse(localStorage.getItem("account"));
  user_id = this.myObj["id"];
  user_type = this.myObj["UserType"];
  site_dash = false;
  customer_home = false;
  super_admin_home = false;
  customer_name = false;
  isShown: boolean = false;

  applyFilter(filterValue: string) {
    this.femsDataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.fetchfireDeviceTypeData();
    this.fireDeviceSnapshotApi();
  }
  fireDeviceSnapshotApi() {
    let data = { "site_id": parseInt(localStorage.getItem("siteId")) }
    this.DataService.fireDeviceSnapshotApi(data).subscribe(
      response => {
        console.log('response of snapshot', response)
        this.totalDevices = response['totalDevices']
        this.warrenty = response['warrenty']
        this.expiry = response['expiredDevice']
      }
    )

  }

  /*Below is the api binding for device fetch device list data from database*/

  fireDevicefetchdata(row: any): void {
    console.log('%%%%%%%%%%%%%%%%%%%%', row)
    let row_id = row.row_id;
    this.devName = row.devName;
    if (this.devName == undefined) {
      this.devName = localStorage.getItem('devName')
    }
    else {
      localStorage.setItem('devName', this.devName);
    }

    console.log("Device Name going to set is : ", this.devName)
    localStorage.setItem('row_id', row_id);
    console.log("Row id going to set is : ", row_id)
    // let data1 = {"devName" :  localStorage.getItem("devName")}
    let data1 = { "row_id": row_id }
    console.log("Row id in data1 set is : ", data1)
    this.DataService.fireDevicefetchdata(data1).subscribe
      (
        response => {
          console.log("response of fireDevicefetchdata", response)
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
              "updatedBy": inventory["updatedby"],
              "id": inventory["id"]
            })
          }
          this.femsDataSource = new MatTableDataSource(inventoryData);
          this.femsDataSource.paginator = this.paginator.toArray()[1];
        }
      )
  }


  /*Below is the api binding for device fetch device type data from database*/

  fetchfireDeviceTypeData() {
    let data3 = { "site_id": parseInt(localStorage.getItem("siteId")) }
    this.DataService.fetchfireDeviceTypeData(data3).subscribe
      (
        response => {
          console.log("response of fetchfireDeviceTypeData list", response)
          let deviceTypeData = []
          for (let i = 0; i <= response['data'].length - 1; i++) {
            let devTypeList = response['data'][i]
            deviceTypeData.push({
              "devName": devTypeList['deviceName'],
              "deviceCat": devTypeList["categories"],
              "row_id": devTypeList["row_id"],

            })
          }
          this.femsAddDevTypeDataSource = new MatTableDataSource(deviceTypeData);
          this.femsAddDevTypeDataSource.paginator = this.paginator.toArray()[0];
          this.femsAddDevTypeDataSource.sort = this.sort.toArray()[0];
        }
      )
  }


  addDevice() {
    console.log("Device saved successfully", this.devName)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = { "deviceName": localStorage.getItem('devName') }
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log("add device closed")
      this.fireDevicefetchdata({ "row_id": localStorage.getItem("row_id") })

    })


  }
  editData(row) {
    console.log("Device saved successfully")
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = row
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log("add device closed")
      this.fireDevicefetchdata({ "row_id": localStorage.getItem("row_id") })
    })




  }


  //  addDevtype():void{
  //   const dialogRef = this.dialog.open(AddDevtypeDialogComponent, {
  //     width: "40%",
  //     // data: {devName: this.devName,deviceCat:this.deviceCat},
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     this.fetchfireDeviceTypeData();
  //     // this.devName = result;
  //   });
  //  }

  addDevType(): void {
    console.log("Device typed dialog box open successfully")
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    const dialogRef = this.dialog.open(AddDevtypeDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log("device type after closed")
      this.fetchfireDeviceTypeData();
    })
  }

  deleteData(row) {
    console.log("row data : ", row);
    var data = { "id": row.id }
    const dialogRef = this.dialog.open(FemsDialogComponent, {
      width: "40%",
      data: data,
    });
    dialogRef.afterClosed().subscribe(result => {
      var devId = localStorage.getItem("row_id")
      this.fireDevicefetchdata({ "row_id": devId })
    });
  }

  baseline() {
    console.log("baseline html hit")
    this.DataService.changeMessage("fems");
    localStorage.setItem("fems-page", 'true');
  }
  warrentyDeviceData() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(DeviceDetailsFemsComponent, dialogConfig);

  }
  expiredDeviceData() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(ExpiredDeviceDetailsFemsComponent, dialogConfig);

  }

  DeviceListTable(row) {
    this.showDevList = true;
    this.fireDevicefetchdata(row);
  }
  DeviceListClose() {
    this.showDevList = false;
  }



}


