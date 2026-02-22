import { DataService } from './../services/data.service';

import { DataTableItem } from './data-table-datasource';
import { changePassword } from './../models/changepassword';
import { DashboardDataService } from './../services/dashboard-data.service';
import { LoginComponent } from './../login/login.component';

import { UserService } from './../services/user.service';
import { AfterViewInit, Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
// import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import * as Highcharts from 'highcharts';

import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

//--------------------new-----------------------------------
// import {MatPaginator} from '@angular/material/legacy-paginator';
// import {MatTableDataSource} from '@angular/material/table';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatSort } from '@angular/material/sort';
import {MatLegacyTable as MatTable} from '@angular/material/legacy-table';
//----------------------------------------------------------




// export interface Food {
//   value: string;
//   viewValue: string;
// }
// export interface Energy {
//   value: string;
//   viewValue: string;
// }

export interface UserData {
  custId: string;
  custUserName: string;
  totalWH: string;
  liveWH: string;
  WHavgsaving: string;
  maxsaving: string;
  minsaving: string;

}

export interface AlarmData {
  custName: string;
  siteName: string;
  alarmName: string;
  alarmDate: string;
  alarmPriority: string;
}

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css'],
})

export class SuperAdminComponent{
  dataSource: MatTableDataSource<UserData>;
  customerDisplayedColumns: string[] = ['custId','custUserName','totalWH','liveWH','WHavgsaving','maxsaving','minsaving'];
  alarmDataSource: MatTableDataSource<AlarmData>;
  alarmsColumns: string[] = ['custName', 'siteName', 'alarmName', 'alarmDate', 'alarmPriority']
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChild(MatTable) table: MatTable<DataTableItem>;
  // snapshot variable defined here
  alarms:any;
  energySaved: any;
  energyConsumed: any;
  percentageSaved: any;


applySelectFilter(event) {
  //alert(event.value);
  //data = event.value;
}
  // foods: Food[] = [
  //   {value: '0', viewValue: 'Daily'},
  //   {value: '1', viewValue: 'Hourly'}
  // ];
  // energys: Energy[] = [
  //   {value: '0', viewValue: 'Energy Consumption'},
  //   {value: '1', viewValue: 'Left Balance'},
  //   {value: '2', viewValue: 'Left Unit'}
  // ];
  selected = '0';
  selected_task = '0';
  date = new UntypedFormControl(new Date());
  serializedDate = new UntypedFormControl((new Date()).toISOString());  

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  isCollapsed : boolean = true;
  color = 'primary';
  mode = 'determinate';
  value = 50;
  oldpwd:string;
  token = localStorage.getItem('token');
  chngpwd;
  isShown : boolean = false;
  userInfo:object[];
  customerInfo:object[];
  totalLoad : any;
  r_volt: any;
  y_volt : any;
  b_volt : any;
  r_current: any;
  y_current: any;
  b_current: any;
  supply_source: any;
  isCustomer:boolean= false;
  isShownDiv: boolean = false ;

  // changePasswordModel = new changePassword(this.token,'','');
  // element: HTMLElement;
  constructor(private dashData:DashboardDataService, private router: Router, private UserService: UserService, private dataService:DataService) {
  }

  ngOnInit() {
   let userObj = JSON.parse(localStorage.getItem("account"));
   let userId = userObj['id']
   let data = {"user_id": userId}
    // calling snapshot api
    this.UserService.getSuperAdminSnapShot(data).subscribe(
      response => {
        console.log("super admin snapshot response : ", response)
        this.date= response["current_date"]
        this.alarms = response["alarms"]
        this.energyConsumed = response["total_unit_consumed"]
        this.energySaved = response["total_energy_saved"]
        this.percentageSaved = response["total_saved_percentage"]

      }
    )
    // calling alarm priority table api
    this.UserService.getSuperAdminAlarmPriorityTable(data).subscribe(
      response => {
        console.log("response : ", response)
        let alarmPriorityData = []
        for(let i=0; i<=response['data'].length - 1; i++){
          let alarm_data = response['data'][i]
          let site_data = alarm_data['alarm_list']
          for(let j=0; j<=site_data.length -1; j++){
            let alarm_priority;
            if(site_data[j]['Alarm_priority'] == 0){
              alarm_priority = 'Low'
            }
            else if(site_data[j]['Alarm_priority'] == 1){
              alarm_priority = 'Medium'
            }
            else{
              alarm_priority = 'High'
            }
            alarmPriorityData.push({
              "custName": alarm_data['customer_name'],
              "siteName": site_data[j]['site_id__site_name'],
              "alarmName": site_data[j]['alarm'],
              "alarmDate": site_data[j]['created_time'],
              "alarmPriority": alarm_priority
            })
          }
          
        }
        this.alarmDataSource = new MatTableDataSource(alarmPriorityData);
        this.alarmDataSource.paginator = this.paginator.toArray()[0];
        this.alarmDataSource.sort = this.sort.toArray()[0];
        // console.log("paginator : ", this.paginator)
      }
    )

    // calling all customer api
    this.UserService.getAllCustomersOnSuperAdmin(data).subscribe(
      response => {
        let customerData = []
        for (let i = 0; i <= response['data'].length-1; i++){
          let cust = response['data'][i]
          customerData.push({"custId": cust['customer_id'],
            "custUserName": cust["customer_name"],
            "totalWH":cust["total_WH"],
            "liveWH":cust["live_Wh"],
            "WHavgsaving":cust["avg_saving"],
            "maxsaving":cust["max_saving"],
            "minsaving":cust["min_saving"]
          })
        }
        this.dataSource = new MatTableDataSource(customerData);
        this.dataSource.paginator = this.paginator.toArray()[1];
        this.dataSource.sort = this.sort.toArray()[1];
      }
    )
  }

   openCustDashboard(row:any):void{
     console.log("dskdnqkwkd: ", row)
    let custId = row.custId
    this.dataService.changeMessage("customer");
    localStorage.setItem('id',custId);
  }
}

   //here is implementation of breadceumb...
  //  if (this.user_type == '1')
  //      {
  //        this.super_admin_home = true
  //        this.customer_home = false
  //        this.admin_home = true
  //        this.customer_name = true
  //        this.site_dash = true
  //        this.saving_site_dash = true
  //      }
  //      else if(this.user_type == '4'){
  //        this.super_admin_home = false
  //        this.customer_home = true
  //      }
  // }
  
/*
  CustomersList(){
    this.UserService.getCustomers().subscribe(data =>{
      this.CustList=data;
        console.log('This List for all New Customers '+ ": " +this.CustList);
    });
  }
*/

  /*
  Super_Admin_Home()
  {
    /*
    this.ifSiteDashboard = false;
    this.ifCustDashboard = false;
    localStorage.removeItem('customer');
    localStorage.removeItem('whouser');
    localStorage.removeItem('wh_metering');
    localStorage.removeItem('energy_savinging');

    location.reload();
    
    console.log("Super_Admin_Home Clicked at superadmin dashboard")
  }
  */

  // getCustomers(){
  //   this.UserService.getAllCustomers().subscribe(
  //     response =>{
  //       console.log('rtotal response', response)
  //       let customer=[];
  //         for (let i = 0; i <= response['data'].length-1; i++) {
  //           let data = response['data'][i];
  //           console.log("dataaaaaaaaaaaaaaaaaa",)
  //           console.log("data of all customers", data)
  //           let customer_details = data['customer']
  //           let customer_id = customer_details['id'];
  //           let customer_username = customer_details['username'];
  //           let customer_email = customer_details['email'];
  //           let customer_contact = customer_details['Contact_number'];
  //           let customer_contact2 = customer_details['Contact_number'];
  //           let customer_contact3 = customer_details['Contact_number'];
  //           let customer_contact4 = customer_details['Contact_number'];
          
  //           customer.push({
  //             'custId': customer_id,
  //             'custUserName': customer_username,
  //             'custEmail' : customer_email,
  //             'custContact': customer_contact,
  //             'custContact2': customer_contact,
  //             'custContact3': customer_contact,
  //             'custContact4': customer_contact
  //           })
  //         }

  //         this.dataSource = new MatTableDataSource(customer);
  //         console.log(this.dataSource);
  //         console.log('This is site data source'+ ": " + this.dataSource);


  //     }
  //   )
  // }

  
  // openCustDashboard(row:any):void{
  //   let custId = row.custId
  //   this.dataService.changeMessage("customer");
  //   localStorage.setItem('id',custId);
  // }


  // valuechange(newValue) {
  //   //mymodel = newValue;
  //   console.log(newValue)
  // }
  // ngAfterViewInit() {
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;
  //   //this.table.dataSource = this.dataSource;
  // }
  // custTable(){
  //   //this.loading = true;
  //   this.UserService.superAdminCustomertable().subscribe(
  //         response => {
  //           let res = response[0];
  //             //this.loading = false;
  //             //console.log('Customer Table : ', response);

  //             //this.dataSource = new DataTableDataSource(this.paginator, this.sort);

  //             //this.dashbaordData = response;
  //             this.userInfo = res['c'];
  //             this.custTable = res['customer'];
  //             //console.log("Yash UserArray: ", this.userInfo);
  //             //console.log("Yash Customer-Array: ", this.customerInfo);

  //             //sessionStorage.setItem("myValue",JSON.stringify(this.dashbaordData));

  //         },
  //         error => {
  //           //this.loading = false;
  //           //console.log('error', error);
  //         }

  //   );



  // }
/*
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
*/
  // getSiteCurrLoadInfoData(){
  //     let data = {'site_id': this.siteId};
  //     this.dashData.getSiteCurrentLoadInfo(data).subscribe(
  //       response => {
  //         console.log(response.Total_Load)
  //         this.totalLoad = response.Total_Load;
  //         this.r_volt = response.R_Voltage;
  //         this.y_volt = response.Y_Voltage;
  //         this.b_volt = response.B_Voltage;
  //         this.r_current = response.R_Current;
  //         this.y_current = response.Y_Current;
  //         this.b_current = response.B_Current;
  //         this.supply_source = response.Power_supply;

  //       },
  //       error => {

  //       }
  //     );
  // }

  // toggleCollapse() {
  //   this.isCollapsed = !this.isCollapsed;
  //   //console.log("Table Ka Click", "gkgkgkgkgk");
  // }

  // getRecord(row){
  //   //console.log("2n Table Row clicked : ",row);
  // }
  // onClickChngpwd(){
  //   this.isShown = true;
  // }
  // customerdetail(id)
  // {
  //   localStorage.setItem('customer','customer');
  //   this.router.navigate(['/dashboard']);
  //   location.reload();
  // }
  // onChangePwd(){

  // this.chngpwd = {'token':this.token,'oldpassword':btoa(this.changePasswordModel.oldpassword),'newpassword':btoa(this.changePasswordModel.newpassword)};
  // this.UserService.changePassword(this.chngpwd).subscribe(
  //   data =>{
  // },
  //   error =>{
  //     console.log("Server Error: ", error);
  //   });
  // }
   // hidden by default


  // toggleShow() {
  //   this.isShownDiv = true;
  // }
  // toggleHide() {
  //   this.isShownDiv = false;
  // }



  /** Builds and returns a new User. */
/*
  function createNewUser(id: number): UserData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    //progress: Math.round(Math.random() * 100).toString(),
    //color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
  */

//export interface PeriodicElement {
//  custid:string;
//  custname:string;
//  contact:string;
//  totalWH: string;
//  liveWH:string;
//  allWH:string;
//  max:string;
//  min:string;
//  custId:number;
//}


// export interface PeriodicElement {
//   custid:number;
//   custUserName:string;
//   custEmail:number;
//   custContact: number;
//   custContact2:number;
//   custContact3:number;
//   custContact4:number;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   {custid: 1,
//   custUserName: 'Hydrogen',
//   custEmail: 1,
//   custContact: 1,
//   custContact2: 1,
//   custContact3:1,
//   custContact4: 1,
//   },
// ];


/* const ELEMENT_DATA: PeriodicElement[] = [
  {custid: 'gh',
  custname: 'Hydrogen',
  contact: 'jhg',
  totalWH: 'H',
  liveWH: 'ghfhsd',
  allWH:'sdfds',
  max: 'hgjhdf',
  min: 'hgfahsd',
custId:1},
];*/


