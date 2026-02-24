import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Observable, interval } from 'rxjs';
import { DataRowOutlet } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AfterViewInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { DataTableItem, DataTableDataSource } from '../super-admin/data-table-datasource';

import { DataService } from './../services/data.service';

export interface EmailData {
  serialno: any;
  siteName: string;
  emailfor: string;
  emailDatetime: string;

}


@Component({
  selector: 'app-fire-pump-alarm',
  templateUrl: './fire-pump-alarm.component.html',
  styleUrls: ['./fire-pump-alarm.component.css']
})


export class FirePumpAlarmComponent implements OnInit {

  emailDataSource: MatTableDataSource<EmailData>;
  alarmsColumns: string[] = ['serialno', 'sitename', 'devicename', 'emailFor', 'emaildatetime',]
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChild(MatTable) table: MatTable<DataTableItem>;

  constructor(private user: UserService, private dataService: DataService) { }
  myObj = JSON.parse(localStorage.getItem("account"));
  user_id = this.myObj["id"];
  user_type = this.myObj["UserType"];
  alarmData = []
  main: any;
  aisleName: any;
  auto: any;
  off: any;
  power_source: any;
  curentDate: any;
  manual_mode_time: any;
  auto_mode_time: any;
  off_mode_time: any;
  motor_status_time: any;
  motor: any;
  data: any;
  site: any;
  fire: any;
  r_volt: any;
  aisleName1: any;
  site_id: any;

  site_dash = false;
  customer_home = false;
  super_admin_home = false;
  customer_name = false;
  Admindata = false;
  showIntervalOptions: boolean = false;
  //s:any
  token



  ngOnInit() {
    this.getFireAlarmData(),
      this.getFireAlarmEmailHistory()

    //   if (this.user_type == '1') {
    //     this.super_admin_home = true
    //     this.customer_home = false
    //     this.customer_name = true //false
    //     this.site_dash = true
    //     this.Admindata = true
    //     this.showIntervalOptions = true
    // }
    // else if (this.user_type == '4') {
    //     this.super_admin_home = false
    //     this.customer_home = true
    //     this.customer_name = false
    //     this.site_dash = true
    //     this.Admindata = false
    //     this.showIntervalOptions = false
    // }
    // else {
    //     this.super_admin_home = false
    //     this.customer_home = true
    //     this.customer_name = false
    //     this.site_dash = true
    //     this.Admindata = false
    // }
  }

  ngAfterViewInit() {
    interval(5000).subscribe(
      response => { this.getFireAlarmData(); }
    );
  }

  customerPage() {
    this.dataService.changeMessage("customer");
  }
  home() {
    localStorage.removeItem('customer');
    location.reload();
  }

  getFireAlarmEmailHistory() {
    //let token = {"token" : localStorage.getItem("token")}
    //let userObj = JSON.parse(localStorage.getItem("account"));
    //let userId = userObj['id']
    //let data = {"token_key": 'a555e475caea6943f789b2b2efc0bbc4bda3c18e'}
    let data = { "site_id": parseInt(localStorage.getItem("siteId")) };
    console.log("dataofsite", data)

    this.user.getEmailHistorySnapShotData(data).subscribe(
      response => {
        console.log("responseofemail: ", response)
        let emailData = []
        for (let i = 0; i <= response['data'].length - 1; i++) {
          let data = response['data'][i]
          let email_var: any;
          if (data['email_for'] == 1) {
            email_var = 'Sent-for Manual Mode'
          }
          else if (data['email_for'] == 2) {
            email_var = 'Sent-for Auto Mode'
          }
          else if (data['email_for'] == 3) {
            email_var = 'PowerSource'
          }
          else if (data['email_for'] == 4) {
            email_var = 'Sent-for OFF Mode'
          }
          else if (data['email_for'] == 5) {
            email_var = 'Sent-for Motor On'
          }
          else {
            email_var = 'Not define'
          }

          //let email_time: Date = data["datetime"];


          emailData.push({
            "sitename": data["site"],
            "devicename": data['device_name'],
            "emailFor": email_var,
            "emaildatetime": data["datetime"],
          })

        }
        this.emailDataSource = new MatTableDataSource(emailData);
        this.emailDataSource.paginator = this.paginator.toArray()[0];
        this.emailDataSource.sort = this.sort.toArray()[0];
      })
  }



  getFireAlarmData() {
    let data = { "site_id": parseInt(localStorage.getItem("siteId")) }
    this.user.getFireAlarmSnapShotData(data).subscribe
      (
        response => {
          // this.alarmData = response['data']
          for (let i = 0; i <= response['data'].length - 1; i++) {
            let fire = response['data'][i]
            var aisleName = fire['aislename']
            var auto = fire['R_Voltage']
            var main = fire['Y_Voltage']
            var off = fire['B_Voltage']
            if (auto > 200 && main < 100 && off > 200) {
              fire['R_Voltage'] = "ON"
              fire['Y_Voltage'] = "OFF"
              fire['B_Voltage'] = "OFF"
            }
            else if (auto < 100 && main > 200 && off > 200) {
              fire['R_Voltage'] = "OFF"
              fire['Y_Voltage'] = "ON"
              fire['B_Voltage'] = "OFF"
            }
            else {
              fire['R_Voltage'] = "OFF"
              fire['Y_Voltage'] = "OFF"
              fire['B_Voltage'] = "ON"
            }
            if (fire["motor_status"] == 0) {
              fire["motor_status"] = "OFF"
            }
            else {
              fire["motor_status"] = "ON"
            }
            this.alarmData.push({
              "aislename": fire['aislename'],
              "R_Voltage": fire["R_Voltage"],
              "Y_Voltage": fire["Y_Voltage"],
              "B_Voltage": fire["B_Voltage"],
              "motor_status": fire["motor_status"],
              "current_date": fire["current_date"]
            })

          }
          console.log("response : ", response)
        })


    //getFireAlarmData(){
    //let token = {"token" : localStorage.getItem("token")}
    //this.user.getFireAlarmSnapShotData().subscribe
    //(
    //response =>
    //{ 
    //console.log("response : ", response)

    //this.curentDate =response['current_date'];
    //this.manual_mode_time = response["manual_time"];
    //this.auto_mode_time = response["auto_mode"];
    //this.off_mode_time = response["off_mode"];
    //this.motor_status_time = response["motor_status_time"];
    //if (response["R_Voltage"] == 0 && response["Y_Voltage"] > 0 && response["Y_Voltage"] <= 60 && response["B_Voltage"] > 200){
    //this.auto = "ON"
    //this.main = "OFF"
    //this.off = "OFF"
    //this.power_source = "ON"

    //}
    //else if (response["R_Voltage"] >200 && response["Y_Voltage"] > 200 && response["B_Voltage"] > 200){
    //this.auto = "ON"
    //this.main = "OFF"
    //this.off = "OFF"
    //this.power_source = "ON"
    //}
    //else if(response["R_Voltage"] > 0 && response["R_Voltage"] <= 150 && response["Y_Voltage"] > 200 && response["B_Voltage"] > 200){
    //this.auto = "OFF"
    //this.main = "ON"
    //this.off = "OFF"
    //this.power_source = "ON"
    //}
    //else if (response["R_Voltage"] > 0 && response["R_Voltage"] < 150 && response["Y_Voltage"] > 0 && response["Y_Voltage"] <= 60 && response["B_Voltage"] > 200){
    //this.auto = "OFF"
    //this.main = "OFF"
    //this.off = "ON"
    //this.power_source = "ON"
    //}
    //else if(response["R_Voltage"] == 0 && response["Y_Voltage"] == 0 && response["B_Voltage"] == 0){
    //this.auto = "OFF"
    //this.main = "OFF"
    //this.off = "OFF"
    //this.power_source = "OFF"
    //}
    //else{
    //console.log("any condition is not true from above")
    //}
    //if(response["motor_status"]==0){
    //this.motor = "OFF"

    //}
    //else{
    //this.motor = "ON"
    //}

    //})
  }
}
