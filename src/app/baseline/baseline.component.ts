import { UntypedFormControl } from '@angular/forms';
import { UserData } from './../customer-dashboard/customer-dashboard.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataTableItem, DataTableDataSource } from '../super-admin/data-table-datasource';
import { DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';
import { UserService } from './../services/user.service';
import { formatDate, getLocaleDayNames } from '@angular/common';
import * as Highcharts from 'highcharts';
import { DataService } from './../services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { DialogSwitchdashComponent } from '../dialog-switchdash/dialog-switchdash.component';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Component({
    selector: 'app-baseline',
    templateUrl: './baseline.component.html',
    styleUrls: ['./baseline.component.css'],
    standalone: false
})

export class BaselineComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  sites;
  graphTitle: string;
  barChartOptions: any = {};
  Highcharts = Highcharts;
  chartConstructor = 'chart';
  chartCallback: any;
  oneToOneFlag = true;
  updateFlag: boolean = false;
  chartLoading: boolean = true;
  selected_graph = '0';
  selected_task = '0';
  filterDate: string;
  picker1: Date;
  picker2: Date;
  date = new UntypedFormControl(new Date());
  serializedDate = new UntypedFormControl((new Date()).toISOString().substring(0, 10));

  aisleGroupName: string;
  dashboardType: string;
  totalLights: number;
  expectedConsumption: any;
  currentConsumption: any;
  siteId = localStorage.getItem('siteId');
  obj = JSON.parse(localStorage.getItem("account"))

  usertype = this.obj['UserType'];
  site_dash = false;
  customer_home = false;
  customer_name = false;
  baseline_dash = false;
  Admindata = false;
  saving_site_dash = false;
  myObj = JSON.parse(localStorage.getItem("account"));
  user_id = this.myObj["id"];
  user_type = this.myObj["UserType"];
  showBaseline: boolean = true;
  showDialog: boolean = false;
  whichGraph = 1;

  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  custBaseline = false;



  constructor(private UserService: UserService, private DataService: DataService, public dialog: MatDialog) {


  }

  ngOnInit() {
    console.log('baseline component');

    // this.getConsumptionData();
    this.baselineData();
    this.getBaselineHistory();

    // i

    if (this.user_type == '1') {
      this.customer_home = false
      this.customer_name = false
      this.site_dash = false
      this.Admindata = true
      this.saving_site_dash = true
      this.baseline_dash = true
      this.custBaseline = true



    }
    else if (this.user_type == '4' || this.user_type == '5') {
      this.customer_home = true
      this.customer_name = false
      this.site_dash = false
      this.Admindata = false
      this.saving_site_dash = true
      this.baseline_dash = true
      this.custBaseline = false
    }
    else {
      this.customer_home = true
      this.customer_name = false
      this.site_dash = false
      this.Admindata = false
      this.saving_site_dash = true
      this.baseline_dash = false
      this.custBaseline = false
    }


    this.DataService.currentMessage.subscribe(
      response => this.dashboardType = response

    );
    console.log("Dashboard type in baseline typescript file", this.dashboardType)
    // this.baselineData();
  }

  displayedColumns: string[] = ['serialNo', 'AisleGroup', 'TotalLights', 'ExpectedConsump', 'CurrentConsump', 'actions'];
  dataSource: MatTableDataSource<UserData>;

  saveConsumption(row: any) {
    // let consumption = '';
    console.log(row)
    console.log('function clicked ')
    // console.log(consumption);
  }


  save(row: any) {
    console.log("save clicked")
    // let consumption = new FormControl('')
    // let consumption = '';

    console.log('consumption :', row);
  }
  openSiteDashboard() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    this.dialog.open(DialogSwitchdashComponent, dialogConfig);
  }
  // onClickSaveBaseline(){
  //   this.showBaseline = false;
  //   this.showDialog = true;
  //   console.log("Inside onclick of save baseline")
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose =true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.width="40%";
  //   this.dialog.open(DialogBox,dialogConfig);
  // }

  //Here is function for daily consumption data.
  getConsumptionData() {
    let todayDate = new Date();
    let tillDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    let fromDate = formatDate(new Date().setDate(todayDate.getDate() - 30), 'yyyy/MM/dd', 'en');
    console.log("From Date is : " + fromDate);
    console.log("From Date is : " + tillDate);
    let data1 = { 'site_id': this.siteId, 'from_date': fromDate, 'till_date': tillDate };
    this.UserService.energySavingMonthlyData(data1).subscribe(
      response => {
        let seriesData = [];
        let seriesData1 = [];
        let seriesData2 = [];
        //this.Highcharts = Highcharts;
        //let xyz = [response['Data'],{"leg":'baseline', 'type': "spline", 'data':[{"a":100,'b':90,'c':80,'d':86,'e':90,'f':100,'g':100,'h':100,'i':100,'j':100,'k':100,'l':100,'m':100,'n':100,'o':100,'p':100,'q':100,'r':100,'s':100,'t':100,'u':100,'v':100,'w':100,'x':100,'y':100,'z':100,'ca':100,'cb':100,'cc':100,'cd':100,}]}]
        for (let k = 0; k < response['Data'].length; k++) {

          let consumption: any;
          consumption = { "name": response['Data'][k]['leg'], 'y': response['Data'][k]['consumption'] }
          let dataSaving = { "name": response['Data'][k]['leg'], 'y': response['Data'][k]['energySaved'] }
          let dataBaseline = { "name": response['Data'][k]['leg'], 'type': 'spline', 'y': response['Data'][k]['baseline'] }


          let data = [{ "data": [consumption, dataSaving, dataBaseline] }]
          // seriesData.push(consumption);
          // seriesData1.push(dataSaving);
          seriesData2.push(data);
        }

        console.log("graph data", this.barChartOptions)
      });
  }
  columnGraphFilterChanged() {
    this.chartLoading = true;
    let mode = this.selected_task;
    let tillDate = formatDate(this.date.value, 'yyyy/MM/dd', 'en');
    let graphType = this.selected_graph;
    let todayDate = new Date();
    let fromDate;
    let categories = [];
    let series = [];

    let selectedYear = this.date.value.getFullYear();
    let selectedMonth = this.date.value.getMonth();
    let selectedMonthYear = formatDate(this.date.value, 'yyyy/MM', 'en');
    let currentMonthYear = formatDate(new Date(), 'yyyy/MM', 'en');
    if (selectedMonthYear == currentMonthYear) {
      // if the daily filter is for current month only
      // then show the last 30 days data
      fromDate = formatDate(new Date().setDate(todayDate.getDate() - 30), 'yyyy/MM/dd', 'en');
    }
    else {
      // if the current month is not same as the selected month
      // then show the data for that complete month
      fromDate = selectedMonthYear + "/01";
      fromDate = formatDate(fromDate, 'yyyy/MM/dd', 'en');
      let day = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      tillDate = selectedMonthYear + "/" + day;
    }



    /**
     *  Call the API on the basis of Graph Type
     */
    if (graphType == '0') {
      // Energy Consumption Graph
      if (mode == '0') {
        // Graph Filter is for daily data

        // Call the API with specific data
        let data = { 'site_id': this.siteId, 'from_date': fromDate, 'till_date': tillDate };
        this.DataService.getGraphData(data).subscribe(
          response => {
            categories = response['Dates'];
            series = response['Data'];
            this.updateFlag = true;
            this.barChartOptions.xAxis.categories = categories;
            this.barChartOptions.series = series;
            this.chartLoading = false;
            // this.updateFlag = true;
          },
          error => { }
        );
      }
      else {
        // Graph Filter is for hourly data
        let data = { 'site_id': this.siteId, 'date': tillDate };
        // this.barChartOptions.plotOptions.column.stacking='percent';

        this.DataService.getSiteHourlyConsumptionData(data).subscribe(
          response => {
            categories = response['Hours'];
            series = response['Data'];
            this.updateFlag = true;
            this.barChartOptions.xAxis.categories = categories;
            this.barChartOptions.series = series;
            this.chartLoading = false;
            // this.updateFlag = true;
          },
          error => { }
        );
      }
    }
    else {
      // Percentage Run Graph
      if (mode == '0') {
        // Graph Filter is for daily data

        // Call the API with specific data
        let data = { 'site_id': this.siteId, 'from_date': fromDate, 'till_date': tillDate };
        //this.barChartOptions.plotOptions.column.stacking='percent'; //mandeep for percentage show
        this.DataService.getDailyPowerSrcDistData(data).subscribe(
          response => {

            categories = response['Dates'];
            series = response['Data'];

            this.barChartOptions.xAxis.categories = categories;
            this.barChartOptions.series = series;
            this.barChartOptions.yAxis.tittle = "abc"
            this.updateFlag = true;
          },
          error => { }
        );
      }
      else {
        // Graph Filter is for hourly data
        let data = { 'site_id': this.siteId, 'date': tillDate };
        this.DataService.getHourlyPowerSrcDistData(data).subscribe(
          response => {
            categories = response['Hours'];
            series = response['Data'];
            this.updateFlag = true;
            this.barChartOptions.xAxis.categories = categories;
            this.barChartOptions.series = series;
            // this.updateFlag = true;
          },
          error => { }
        );
      }
    }
  }
  baselineData() {
    let data = { 'site_id': this.siteId, 'date': formatDate(this.date.value, 'yyyy/MM/dd', 'en') };
    this.DataService.fetchBaselineData(data).subscribe(
      response => {
        let baselinedata = [];
        for (let i = 0; i < response['data'].length; i++) {
          let data = response['data'][i];
          baselinedata.push({
            'serialNo': i + 1,
            'AisleGroup': data['aisle_name'],
            'TotalLights': data['total_lights'],
            'ExpectedConsump': data['expected_consumption'],
            'CurrentConsump': data['current_consumption']
          })
        }
        console.log("baseline data is here...", baselinedata)
        this.dataSource = new MatTableDataSource(baselinedata);
        this.dataSource.paginator = this.paginator;  //mandeep
        this.dataSource.sort = this.sort;

        // this.aisleGroupName = response['data']['aisle_name']
        // this.totalLights = response['data']['total_lights']
        // this.expectedConsumption = response["data"]['expected_consumption']
        // this.currentConsumption = response['data']['current_consumption']
      }
    )
  }

  getBaselineHistory() {
    let data = { 'site_id': this.siteId, "userType": this.usertype };
    console.log('Here usertype is', data)
    //  let categories = [];
    //  let series = [];
    this.UserService.getBaselineHistory(data).subscribe(
      response => {
        // categories = response['Dates'];
        // series = response['Data'];
        // this.updateFlag = true;
        //  this.barChartOptions.xAxis.categories= categories;
        //  this.barChartOptions.series = series;
        console.log('This is data of baseline history', response)

        this.barChartOptions = {
          colorCount: '12',
          colors: ['#90ED7D', '#ff7a01', '#7cb5ec', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
          credits: {
            enabled: false,
          },

          chart: {
            backgroundColor: '#222222',
            type: 'column'
          },
          title: {
            text: this.graphTitle,
            style: {
              color: 'white',
            },
          },

          xAxis: {
            labels: {
              style: {
                color: 'white',
              },
            },
            categories: response['Dates']
          },


          yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
              style: { color: 'white', },
              text: 'Number of units (kWh)'
            },
            labels: {
              style: {
                color: 'white'
              }
            }
          },


          tooltip: {
            formatter: function () {
              return '<b>' + this.x + '</b><br/>' +
                this.series.name + ': ' + this.y + '<br/>' +
                'Total: ' + this.point.stackTotal;
            }
          },

          plotOptions: {
            column: {
              stacking: 'normal',
              //colors: ['orange', 'white', 'blue']
            },
            // series: {
            //   color:'#ff7a01'},
          },

          legend: {
            itemStyle: { color: 'white', },
          },

          series: response["Data"]

        }
        this.chartLoading = false;


      }


    )
    console.log("baseline history bar chart data", this.barChartOptions)


  }

  saveBaselineData(row) {
    let data = { "siteId": this.siteId, "legId": row['AisleGroup'], "baselineValue": row["CurrentConsump"], "date": formatDate(this.date.value, 'yyyy/MM/dd', 'en') }
    console.log("saving baseline data", row)
    this.DataService.saveBaselineData(data).subscribe(
      response => {

        console.log("baseline saved successfully")
      }

    )
    this.DataService.success('Baseline saved successfully !');

  }

  home() {

    localStorage.removeItem('customer');
    localStorage.removeItem('whouser');
    localStorage.removeItem('wh_metering');
    localStorage.removeItem('energy_saving');

    location.reload();
  }

  customerPage() {

    localStorage.removeItem('whouser');
    localStorage.removeItem('wh_metering');
    localStorage.removeItem('energy_saving');
    location.reload();
  }
  sitePage() {
    localStorage.removeItem('baseline');
    localStorage.setItem('energy_saving', 'true');
    this.DataService.changeMessage("energy_saving");
    localStorage.setItem('siteId', this.siteId);
  }

  changeGraphStacking() {
    this.whichGraph ^= 0x1;

    if (this.whichGraph == 0) {
      this.barChartOptions.plotOptions.column.stacking = '';
      this.updateFlag = true;
      console.log('Inside normal stacking false')
    }
    else {
      this.barChartOptions.plotOptions.column.stacking = 'normal';
      this.updateFlag = true;
      console.log('Inside normal stacking True')
    }
  }

}

export interface PeriodicElement {
  serialNo: string;
  AisleGroup: string;
  TotalLights: string;
  wattage1Light: string;
  ExpectedConsump: string;
  CurrentConsump: string;


}
const ELEMENT_DATA: PeriodicElement[] = [
  { serialNo: '1', AisleGroup: 'aisle 1', TotalLights: '60', wattage1Light: '20W', ExpectedConsump: '288(KWH)', CurrentConsump: '230' },
  { serialNo: '2', AisleGroup: 'aisle 2', TotalLights: '60', wattage1Light: '20W', ExpectedConsump: '288(KWH)', CurrentConsump: '230' },
  { serialNo: '3', AisleGroup: 'aisle 3', TotalLights: '60', wattage1Light: '20W', ExpectedConsump: '288(KWH)', CurrentConsump: '230' },
  { serialNo: '4', AisleGroup: 'aisle 4', TotalLights: '60', wattage1Light: '20W', ExpectedConsump: '288(KWH)', CurrentConsump: '230' },
  { serialNo: '5', AisleGroup: 'aisle 5', TotalLights: '60', wattage1Light: '20W', ExpectedConsump: '288(KWH)', CurrentConsump: '230' }


];
export class DialogBox {


}