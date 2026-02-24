
import { DataService } from './../services/data.service';
import { DataTableItem, DataTableDataSource } from '../super-admin/data-table-datasource';
import { changePassword } from './../models/changepassword';
import { DashboardDataService } from './../services/dashboard-data.service';
import { LoginComponent } from './../login/login.component';
// import {LightsDataComponent} from './lights-data/lights-data.component';

import { UserService } from './../services/user.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import * as Highcharts from 'highcharts';
//import {MatPaginator} from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
// import {formatDate} from '@angular/common';
import { formatDate, getLocaleDayNames } from '@angular/common';
import { SiteDetailsModel, LiveMeteringDataModel } from './../models/siteDataModel';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { DialogSwitchdashComponent } from '../dialog-switchdash/dialog-switchdash.component';
import { Router } from '@angular/router';
import { preserveWhitespacesDefault } from '@angular/compiler';
import { LightsWattDataComponent } from '../lights-watt-data/lights-watt-data.component';
import { FanswattdataComponent } from '../fanswattdata/fanswattdata.component';
import { AvgDataComponent } from '../avg-data/avg-data.component';
import { ExcelsheetComponent } from '../excelsheet/excelsheet.component';


declare var $: any;



// export interface Food {
//   value: string;
//   viewValue: string;
// }
// export interface Energy {
//   value: string;
//   viewValue: string;
// }

export interface KeyValueIf {
  value: string;
  viewValue: string;
}


@Component({
    selector: 'app-warehouse',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.css'],
    standalone: false
})


export class WarehouseComponent implements OnInit {

  minDate = new Date(2000, 0, 1);
  maxDate = new Date();

  // highCharts = HighCharts;
  applySelectFilter(event) {
    //alert(event.value);
    //data = event.value;
  }
  intervals: KeyValueIf[] = [
    { value: '0', viewValue: 'Daily' },
    { value: '1', viewValue: 'Hourly' }
  ];

  graphTypes: KeyValueIf[] = [
    { value: '0', viewValue: 'Energy Consumption' },
    { value: '1', viewValue: 'Energy Saved' }
  ];

  selected_graph = '0';
  selected_task = '0';
  date = new UntypedFormControl(new Date());
  serializedDate = new UntypedFormControl((new Date()).toISOString().substring(0, 10));
  filterDate: string;
  picker1: Date;
  dashboardType: string;
  showIntervalOptions: boolean = false;
  showDailygraph: boolean = true;
  showHourlygraph: boolean = false;
  is_carbon_emission_visible: any = localStorage.getItem('carbon_emission_visible');
  data1;

  // applySelectFilter(event) {
  //   //alert(event.value);
  //   //data = event.value;
  // } 
  //   foods: Food[] = [
  //     {value: '0', viewValue: 'Daily'},
  //     {value: '1', viewValue: 'Hourly'}
  //   ];
  //   energys: Energy[] = [
  //     {value: '0', viewValue: 'Energy Consumption'},
  //     {value: '1', viewValue: 'Left Balance'},
  //     {value: '2', viewValue: 'Left Unit'}
  //   ];
  //   selected = '0';
  //   selected_task = '0';
  //   date = new FormControl(new Date());
  //   serializedDate = new FormControl((new Date()).toISOString());





  liveData = new LiveMeteringDataModel();
  public pieChartOptions: any;
  graphTitle: string;
  // selected_graph = '0';
  updateFlag: boolean = false;
  whichGraph = 1;
  ishide = 1;
  previous: any;
  graphShown: Boolean = true;
  //displayedColumns: string[] = ['id', 'name', 'email', 'mobile','address'];
  //dataSource: DataTableDataSource;

  //@ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;
  //@ViewChild(MatTable) table: MatTable<DataTableItem>

  //displayedColumns: string[] = ['cust_id', 'name', 'contact', 'email', 'sites','energyConsume', 'savedEnergy'];
  //custTab = JSON.parse(sessionStorage.getItem("myValue"));
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource: MatTableDataSource<SiteAlarmData>; //mandeep
  tableData: any;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<DataTableItem>;
  @ViewChild('chart') chart;
  //dataSource: DataTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  //displayedColumns = ['id', 'name'];
  isCollapsed: boolean = true;
  color = 'primary';
  mode = 'determinate';
  value = 50;
  oldpwd: string;
  token = localStorage.getItem('token');
  chngpwd;
  isShown: boolean = false;
  userInfo: object[];
  customerInfo: object[];
  totalLoad: any;
  r_volt: any;
  y_volt: any;
  b_volt: any;
  r_current: any;
  y_current: any;
  b_current: any;
  supply_source: any;
  dates: object[];
  myData: object[];

  is_hourly_data_visible: any = localStorage.getItem("is_hourly_data_visible")
  loading = true;
  barChartOptions: any = {};
  lineChartOptions: any = {};
  updatedbarChartOptions: any = {};
  Highcharts = Highcharts;
  chartConstructor = 'chart';
  chartCallback: any;
  oneToOneFlag = true;
  pieChart = Highcharts;
  chartLoading: boolean = true;
  trendChartLoading: boolean = true;
  //breadcrumbs keywords 
  myObj = JSON.parse(localStorage.getItem("account"));
  user_id = this.myObj["id"];
  user_type = this.myObj["UserType"];
  site_dash = false;
  super_admin_home = false;
  customer_home = false;
  customer_name = false;
  Admindata = false;
  saving_site_dash = false;
  percentageSaved;
  carbonValue;
  alarms;
  savedEnergy;
  energyConsumed;
  liveDate;
  showAlarm;
  sitename;
  customerOnly: boolean = true;
  avgDataValue: boolean = false
  MyntraLightsOnly: boolean = false
  MyntraFansOnly: boolean = false

  // siteAlarmData = new SiteAlarmData(); 


  // This site id is just for demo purpose should be replaced by original
  // once the function is moved to customer dashboard
  siteId;
  changePasswordModel = new changePassword(this.token, '', '');

  // Trend Export Modal Properties
  showTrendExportModal: boolean = false;
  trendExportFromMonth: string;
  trendExportFromYear: number;
  trendExportToMonth: string;
  trendExportToYear: number;

  months = [
    { value: '01', viewValue: 'January' },
    { value: '02', viewValue: 'February' },
    { value: '03', viewValue: 'March' },
    { value: '04', viewValue: 'April' },
    { value: '05', viewValue: 'May' },
    { value: '06', viewValue: 'June' },
    { value: '07', viewValue: 'July' },
    { value: '08', viewValue: 'August' },
    { value: '09', viewValue: 'September' },
    { value: '10', viewValue: 'October' },
    { value: '11', viewValue: 'November' },
    { value: '12', viewValue: 'December' }
  ];

  years: number[] = [];

  openTrendExportModal() {
    this.showTrendExportModal = true;

    // Initialize Years (Current year - 5 to Current year + 1)
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      this.years.push(i);
    }

    // Default to current month/year
    const today = new Date();
    this.trendExportToYear = today.getFullYear();
    this.trendExportToMonth = ("0" + (today.getMonth() + 1)).slice(-2); // 0-indexed

    // Default From to 1 month ago
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    this.trendExportFromYear = lastMonth.getFullYear();
    this.trendExportFromMonth = ("0" + (lastMonth.getMonth() + 1)).slice(-2);
  }

  closeTrendExportModal() {
    this.showTrendExportModal = false;
  }

  submitTrendExport() {
    if (this.trendExportFromMonth && this.trendExportFromYear && this.trendExportToMonth && this.trendExportToYear) {
      // Construct month strings in YYYY-MM format as per API requirement
      const fromMonth = `${this.trendExportFromYear}-${this.trendExportFromMonth}`;
      const toMonth = `${this.trendExportToYear}-${this.trendExportToMonth}`;

      console.log(`Exporting Trend Data from ${fromMonth} to ${toMonth}`);
      console.log(`Site: ${this.sitename}`);

      let data = {
        "site_id": this.siteId,
        "from_month": fromMonth,
        "to_month": toMonth,
        "user_type": this.user_type
      }

      this.DataService.showLoader();
      this.DataService.savingMonthlyTrendExcel(data).subscribe(
        (response: any) => {
          this.downloadFile(response);
          this.DataService.hideLoader();

          const msg = `Download Successful! ${this.sitename} Monthly Trend (${fromMonth} - ${toMonth})`;
          this.DataService.showCustomSuccess(msg);

          this.closeTrendExportModal();
        },
        error => {
          this.DataService.hideLoader();
          console.error("Error exporting trend data", error);
        }
      )
    }
  }

  // Energy Export Modal Properties (Total Energy Consumption)
  showEnergyExportModal: boolean = false;
  energyExportStartDate: Date;
  energyExportEndDate: Date;

  openEnergyExportModal() {
    this.showEnergyExportModal = true;
    this.energyExportEndDate = new Date();
    this.energyExportStartDate = new Date();
    this.energyExportStartDate.setDate(this.energyExportEndDate.getDate() - 30);
  }

  closeEnergyExportModal() {
    this.showEnergyExportModal = false;
  }

  submitEnergyExport() {
    if (this.energyExportStartDate && this.energyExportEndDate) {
      const formattedFrom = formatDate(this.energyExportStartDate, 'yyyy-MM-dd', 'en');
      const formattedTo = formatDate(this.energyExportEndDate, 'yyyy-MM-dd', 'en');

      console.log(`Exporting Energy Data from ${formattedFrom} to ${formattedTo}`);
      console.log(`Site: ${this.sitename}`);

      let data = {
        "user_id": this.user_id,
        "user_type": this.user_type,
        "site_id": this.siteId,
        "from_date": formattedFrom,
        "end_date": formattedTo,
      }

      this.DataService.showLoader();
      this.DataService.excelDataValue(data).subscribe(
        (response: any) => {
          this.downloadFile(response);
          this.DataService.hideLoader();

          const msg = `Download Successful! ${this.sitename} Energy Saving (${formattedFrom} - ${formattedTo})`;
          this.DataService.showCustomSuccess(msg);

          this.closeEnergyExportModal();
        },
        error => {
          this.DataService.hideLoader();
          console.error("Error exporting data", error);
        }
      )
    }
  }

  downloadFile(response: any) {
    let date = new Date().getDate().toString() + '-' + new Date().toLocaleDateString("en-US", { month: 'short' }) + '-' + new Date().getFullYear().toString();
    let blob: Blob = response.body as Blob;
    var downloadURL = window.URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = downloadURL;
    link.download = ("energy_data_" + date + ".csv")
    link.click();
  }

  constructor(private dashData: DashboardDataService, private UserService: UserService, private DataService: DataService, public dialog: MatDialog, private router: Router,) {


  }

  ngOnInit() {
    if (this.is_carbon_emission_visible == "true") {
      this.is_carbon_emission_visible = true;
    } else {
      this.is_carbon_emission_visible = false
    }

    this.siteId = localStorage.getItem('siteId');
    this.sitename = localStorage.getItem('sitename')
    console.log('here site id in energy saving', this.siteId)

    //here is implementation of breadcrumb...
    if (this.user_type == '1') {
      this.super_admin_home = true
      this.customer_home = false
      this.customer_name = true  //false
      this.site_dash = false
      this.Admindata = true
      this.saving_site_dash = true
      this.showIntervalOptions = true


    }
    else if (this.user_type == '4' || this.user_type == '5') {
      this.customer_home = true
      this.customer_name = false
      this.site_dash = false
      this.Admindata = false
      this.saving_site_dash = true
      this.customerOnly = false
      this.avgDataValue = true
      if (this.is_hourly_data_visible == 'true') {
        this.showIntervalOptions = true
      }
      else {
        this.showIntervalOptions = false;
      }
    }
    else {
      this.customer_home = true
      this.customer_name = false
      this.site_dash = false
      this.Admindata = false
      this.saving_site_dash = true
    }
    if (this.siteId == '29') {
      this.MyntraLightsOnly = true
    }
    if (this.siteId == '34') {
      this.MyntraFansOnly = true
    }
    //this.getPowerSourceDistData();
    this.getConsumptionData();
    this.getMonthlyTrend();
    this.getSiteSnapshot();

  }

  displayedColumns1 = ['alarm_type', 'object_type', 'alarm_priority', 'created_date'];


  //Here is define function for getting site snapshot(energy-saved, saved% etc)
  getSiteSnapshot() {
    let data = { "site_id": this.siteId, "user_type": this.user_type }
    this.UserService.getSiteSnapshot(data).subscribe(
      response => {
        this.alarms = response['alarms'];
        this.energyConsumed = response['energy_consumed'];
        this.savedEnergy = response['saved_energy'];
        this.percentageSaved = response['percentage_saved']
        this.carbonValue = response['carbon_emission_saved']
        this.liveDate = response['live_date'];
        this.previous = response['previous_date']

      });
  }

  valuechange(newValue) {
    //mymodel = newValue;
    console.log(newValue)
  }
  //   ngAfterViewInit() {
  //     Observable.interval(5000).subscribe(
  //         response => { this.getConsumptionData(); }
  //     );
  // }
  getCust() {
    this.dashData.getCustomerDetail().subscribe(
      response => {
      });
  }
  alarmTable() {
    this.getSiteAlarmsDetails();
    this.showAlarm = true;

  }
  AlarmTableClose() {
    this.showAlarm = false;
  }

  custTable() {
    //this.loading = true;
    this.UserService.superAdminCustomertable().subscribe(
      response => {
        let res = response[0];
        //this.loading = false;
        //console.log('Customer Table : ', response);

        //this.dataSource = new DataTableDataSource(this.paginator, this.sort);

        //this.dashbaordData = response;
        this.userInfo = res['c'];
        this.custTable = res['customer'];
        //console.log("Yash UserArray: ", this.userInfo);
        //console.log("Yash Customer-Array: ", this.customerInfo);

        //sessionStorage.setItem("myValue",JSON.stringify(this.dashbaordData));

      },
      error => {
        //this.loading = false;
        //console.log('error', error);    
      }

    );


  }
  changeGraphStacking() {
    this.whichGraph ^= 0x1;

    if (this.whichGraph == 0) {
      try {
        this.barChartOptions.plotOptions.column.stacking = ''; // for daily
      }
      catch {
        console.log("error in daily")
      }
      try {
        this.updatedbarChartOptions.plotOptions.column.stacking = '';  // for hourly
      }
      catch {
        console.log("err in hourly")
      }
      this.updateFlag = true;
      console.log('Inside normal stacking false')
    }
    else {
      try {
        this.barChartOptions.plotOptions.column.stacking = 'normal'; // for daily
      } catch { console.log("error in daily....") }
      try {
        this.updatedbarChartOptions.plotOptions.column.stacking = 'normal'; // for hourly
      } catch { console.log("error in hourly ....") }
      this.updateFlag = true;
      console.log('Inside normal stacking True')
    }
  }


  reenable() {
    // console.log("reenable function called,", this.barChartOptions.series)
    // this.barChartOptions.series = []
    // this.chart.chart.legend.allItems.forEach(item=>item.setVisible(false));
    // console.log(this.chart.chart.options)
    // console.log(this.chart.chart.options.series)
    // this.chart.chart.options.series[0].hide()
    // this.chart.chart.options.xAxis = []
    // this.chart.chart.options.yAxis = []
    // console.log(this.chart.chart.options)
    // console.log(this.chart.chart.options.series)
    // console.log("legends are: ", this.chart.chart.legend.allItems)

    this.ishide ^= 0x1;

    if (this.ishide == 1) {
      this.graphShown = true
      // this.chart.chart.legend.allItems.forEach(item=>item.setVisible(true));
      // this.chart.chart.legend.allItems.forEach(item=>console.log("item : ", item));
      let chartData = this.chart.chart.legend.allItems
      for (let i = 0; i <= chartData.length - 1; i++) {
        console.log("data : ", chartData[i])
        chartData[i].setVisible(true, false)
      }
      this.chart.chart.redraw()
      console.log("reenable function true")
    }
    else {
      this.graphShown = false
      let chartData = this.chart.chart.legend.allItems
      for (let i = 0; i <= chartData.length - 1; i++) {
        console.log("data : ", chartData[i])
        chartData[i].setVisible(false, false)
      }
      this.chart.chart.redraw()
      // chartData.redraw()
      // console.log("first record : ", chartData[0])
      // chartData[0].setVisible(false)
      // this.chart.chart.legend.allItems.forEach(item=>item.setVisible(false));
    }



  }
  getSiteAlarmsDetails() {


    let data1 = { "site_id": this.siteId }
    this.UserService.getAlarmOnSitePage(data1).subscribe(
      response => {
        let data = [];
        for (let i = 0; i <= response['data'].length - 1; i++) {
          let res = response['data'][i]
          let alarm_type = res['alarm_type'];
          let object_type = res['object_type'];
          let object_name = res['object_name'];
          let alarm_priority = res['alarm_priority'];
          let created_date = res['created_date'];
          data.push({
            "alarm_type": alarm_type,
            "object_type": object_type,
            "object_name": object_name,
            "alarm_priority": alarm_priority,
            "created_date": created_date
          })
        }
        this.dataSource = new MatTableDataSource(data);
        console.log(data);
        this.dataSource.paginator = this.paginator;  //mandeep
        this.dataSource.sort = this.sort;  //mandeep

      },
      error => { }
    );
  }


  getcustomerSnapshot() {
    let data = { "site_id": this.siteId }
    this.UserService.siteSnapshot(data).subscribe(
      response => {
        console.log(response);

      }
    )
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    //console.log("Table Ka Click", "gkgkgkgkgk");
  }

  getRecord(row) {
    //console.log("2n Table Row clicked : ",row);
  }
  onClickChngpwd() {
    this.isShown = true;
  }
  customerdetail(obj) {
    console.log(obj);
  }
  onChangePwd() {

    this.chngpwd = { 'token': this.token, 'oldpassword': btoa(this.changePasswordModel.oldpassword), 'newpassword': btoa(this.changePasswordModel.newpassword) };
    this.UserService.changePassword(this.chngpwd).subscribe(
      data => {
        //console.log("server_Res: ", data);
      },
      error => {
        console.log("Server Error: ", error);
      });
  }

  home() {
    localStorage.removeItem('customer');
    location.reload();
  }

  customerPage() {
    this.DataService.changeMessage("customer");
  }

  //Here is implementation of bar graph daily and hourly data

  getConsumptionData() {

    let todayDate = new Date();
    let tillDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    let fromDate = formatDate(new Date().setDate(todayDate.getDate() - 30), 'yyyy/MM/dd', 'en');
    let data1 = { 'site_id': this.siteId, 'from_date': fromDate, 'till_date': tillDate, "user_type": this.user_type };
    this.UserService.warehouseMonthlyData(data1).subscribe(
      response => {
        console.log("ressnw  : ", response)
        // $(function () {
        this.barChartOptions = {
          colorCount: '12',
          colors: ['#90ED7D', '#ff7a01', '#7cb5ec', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
          credits: {
            enabled: false,
          },

          chart: {
            backgroundColor: '#222222',
            type: 'column',
            zoomType: 'x',
            setVisible: 'false',
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
            // max:6000,
            title: {
              style: { color: 'white', },
              text: 'Number of units (kWh)'
            },
            labels: {
              style: {
                color: 'white'
              }
            },

            stackLabels: {
              enabled: true,
              rotation: 270,
              y: -28,
              style: {
                color: 'white',
                fontSize: '11px',
                verticalAlign: "top",
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
            // series:{
            //   pointWidth:15
            // },
            column: {
              stacking: 'normal',
              maxPointWidth: 50
              //colors: ['orange', 'white', 'blue']
            },



          },

          legend: {
            itemStyle: { color: 'white', },
            // showInLegend: false,
            // verticalAlign: 'top', 
            // enabled: true,
            maxHeight: 80,
            y: 10,

            // x:15,
            navigation: {
              activeColor: 'white',
              animation: true,
              arrowSize: 12,
              inactiveColor: '#333',
              style: {
                fontWeight: '2px',
                color: 'white'

              }
            }


          },
          series: response["Data"],

        }
        console.log("graph data", this.barChartOptions)
        this.chartLoading = false;

      });

  }


  columnGraphFilterChanged() {

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
    let hourlySelectedDate = formatDate(this.date.value, 'yyyy/MM/dd', 'en');
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
        this.showHourlygraph = false;
        this.showDailygraph = true;
        this.chartLoading = true;
        // Call the API with specific data
        let data = { 'site_id': this.siteId, 'from_date': fromDate, 'till_date': tillDate, "user_type": this.user_type };
        this.UserService.warehouseMonthlyData(data).subscribe(
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
        this.showDailygraph = false;
        this.showHourlygraph = true;
        this.chartLoading = true;
        let data = { 'site_id': this.siteId, 'date': hourlySelectedDate };
        console.log('This is mine selected Date in hourly data', hourlySelectedDate);
        // this.barChartOptions.plotOptions.column.stacking='percent';

        this.UserService.warehouseHourlyData(data).subscribe(
          response => {
            // this.chart.chart.redraw()
            // categories = response['Hours'];
            // series = response['Data'];
            // this.updateFlag = true;
            // this.barChartOptions.xAxis.categories= categories;
            // this.barChartOptions.series = series;
            // this.updateFlag = true;
            this.updatedbarChartOptions = {
              colorCount: '12',
              colors: ['#90ED7D', '#ff7a01', '#7cb5ec', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
              credits: {
                enabled: false,
              },

              chart: {
                backgroundColor: '#222222',
                type: 'column',
                zoomType: 'x',
                setVisible: 'false',
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
                categories: response['Hours']
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
                },
                stackLabels: {
                  enabled: true,
                  rotation: 270,
                  y: -28,
                  style: {
                    color: 'white',
                    fontSize: '11px',
                    verticalAlign: "top",
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
                // series:{
                //   pointWidth:15
                // },
                column: {
                  stacking: 'normal',
                  maxPointWidth: 50
                  //colors: ['orange', 'white', 'blue']
                },



              },

              legend: {
                itemStyle: { color: 'white', },
                // showInLegend: false,
                // verticalAlign: 'top', 
                // enabled: true,
                maxHeight: 80,
                y: 10,

                // x:15,
                navigation: {
                  activeColor: 'white',
                  animation: true,
                  arrowSize: 12,
                  inactiveColor: '#333',
                  style: {
                    fontWeight: '2px',
                    color: 'white'

                  }
                }


              },
              series: response["Data"],

            }
            // this.chart.chart.redraw()
            console.log("hour : ", this.updatedbarChartOptions);
            this.chartLoading = false;
          },
          error => { }
        );
      }
    }
    else {
      // Graph for energy saving data ....
      if (mode == '0') {
        // Graph Filter is for daily data
        this.showDailygraph = true;
        this.showHourlygraph = false;
        this.chartLoading = true;
        // Call the API with specific data
        let data = { 'site_id': this.siteId, 'from_date': fromDate, 'till_date': tillDate, "user_type": this.user_type };
        //this.barChartOptions.plotOptions.column.stacking='percent'; //mandeep for percentage show
        this.UserService.warehouseMonthlyData(data).subscribe(
          response => {

            categories = response['Dates'];
            series = response['SavingData'];

            this.barChartOptions.xAxis.categories = categories;
            this.barChartOptions.series = series;
            this.updateFlag = true;
            this.chartLoading = false;
          },
          error => { }
        );
      }
      else {
        this.showDailygraph = false;
        this.showHourlygraph = true;
        this.chartLoading = true;
        // Graph Filter is for hourly data
        let data = { 'site_id': this.siteId, 'date': hourlySelectedDate };
        console.log('This is mine selected Date in hourly data for energy saving data', hourlySelectedDate);
        this.UserService.warehouseHourlyData(data).subscribe(
          response => {
            console.log("respsmdksk: ", response)
            categories = response['Hours'];
            series = response['SavingData'];
            this.updateFlag = true;
            this.updatedbarChartOptions.xAxis.categories = categories;
            this.updatedbarChartOptions.series = series;
            this.updateFlag = true;
            this.chartLoading = false;
          },
          error => { }
        );
      }
    }
  }







  //Call function for monthly trend Graph.....
  getMonthlyTrend() {


    let data1 = { 'site_id': this.siteId, "user_type": this.user_type };
    if (this.is_carbon_emission_visible == true) {
      this.UserService.energySavingMonthlyTrend(data1).subscribe(
        response => {
          let seriesData = [];
          //this.Highcharts = Highcharts;
          //let xyz = [response['Data'],{"leg":'baseline', 'type': "spline", 'data':[{"a":100,'b':90,'c':80,'d':86,'e':90,'f':100,'g':100,'h':100,'i':100,'j':100,'k':100,'l':100,'m':100,'n':100,'o':100,'p':100,'q':100,'r':100,'s':100,'t':100,'u':100,'v':100,'w':100,'x':100,'y':100,'z':100,'ca':100,'cb':100,'cc':100,'cd':100,}]}]


          let energyConsumed: any;
          energyConsumed = { "name": "energyConsumed", 'type': "spline", 'y': response['energyConsumed'] }
          let enegySaved = { "name": "energySaved", 'type': 'spline', 'y': response['energySaved'] }
          let percentageSaved = { "name": "percentageSaved", 'type': 'spline', 'y': response['percentageSaved'] }
          let carbonSaved = { "name": "carbonSaved", 'type': 'spline', 'y': response['carbon_saved'] }



          let data2 = [{ "data": [energyConsumed, enegySaved, percentageSaved, carbonSaved] }]
          // seriesData.push(consumption);
          // seriesData1.push(dataSaving);
          seriesData.push(data2);


          // highcharts = Highcharts;
          this.lineChartOptions = {
            colorCount: '4',
            colors: ['#90ED7D', '#ff7a01', '#7cb5ec', '#058DC7'],
            chart: {
              type: "spline",
              backgroundColor: "#222222",

              overflow: 'scroll'
            },
            title: {
              style: {
                color: 'white',
              },
              text: 'Snapshot Monthly Trend'
            },
            credits: {
              enabled: false
            },
            xAxis: {
              labels: {
                style: {
                  color: 'white',
                },
              },
              categories: response['months']
            },
            // yAxis: {
            //   title: {
            //     style: {color:'white',},
            //     text: "Value"
            //   },
            //   labels : {
            //     style: {
            //       color:'white'
            //     }
            //   }
            // },

            yAxis: [{ // Primary yAxis
              labels: {
                // format: '{value} units',
                style: {
                  color: '#ff7a01'
                }
              },
              title: {
                text: 'Units (KWH)',
                style: {
                  color: '#ff7a01'
                }
              },
              opposite: false

            }, { // Secondary yAxis
              gridLineWidth: 0,
              title: {
                text: 'Percentage Saved',
                style: {
                  color: '#7cb5ec'
                }
              },
              labels: {
                format: '{value} %',
                style: {
                  color: '#7cb5ec'
                }

              },
              opposite: true

            }],



            tooltip: {
              formatter: function () {
                let date = new Date().toLocaleDateString("en-US", { month: 'short' }) + '-' + new Date().getFullYear().toString();
                if (date == this.x) {
                  var d = new Date(); // today!
                  d.setDate(d.getDate() - 1);
                  return '<b>' + 'till' + ' ' + d.getDate().toString() + '-' + new Date().toLocaleDateString("en-US", { month: 'short' }) + '-' + new Date().getFullYear().toString() + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>'
                }
                return '<b>' + this.x + '</b><br/>' +
                  this.series.name + ': ' + this.y + '<br/>'

              }
            },
            legend: {
              itemStyle: { color: 'white', },
            },
            series: [

              {
                name: 'Energy Consumed',
                data: response['energyConsumed'],


              },
              {
                name: 'Energy Saved',
                data: response["energySaved"],


              },
              {
                name: 'Carbon Emission Saved',
                data: response["carbon_saved"],


              },
              {
                yAxis: 1,
                name: 'Percentage Saved',
                data: response["percentageSaved"],

              }
            ]
          }
          console.log("graph data", this.lineChartOptions)
        });
    }
    else {
      console.log("else##################################")
      this.UserService.energySavingMonthlyTrend(data1).subscribe(
        response => {
          let seriesData = [];
          //this.Highcharts = Highcharts;
          //let xyz = [response['Data'],{"leg":'baseline', 'type': "spline", 'data':[{"a":100,'b':90,'c':80,'d':86,'e':90,'f':100,'g':100,'h':100,'i':100,'j':100,'k':100,'l':100,'m':100,'n':100,'o':100,'p':100,'q':100,'r':100,'s':100,'t':100,'u':100,'v':100,'w':100,'x':100,'y':100,'z':100,'ca':100,'cb':100,'cc':100,'cd':100,}]}]


          let energyConsumed: any;
          energyConsumed = { "name": "energyConsumed", 'type': "spline", 'y': response['energyConsumed'] }
          let enegySaved = { "name": "energySaved", 'type': 'spline', 'y': response['energySaved'] }
          let percentageSaved = { "name": "percentageSaved", 'type': 'spline', 'y': response['percentageSaved'] }



          let data2 = [{ "data": [energyConsumed, enegySaved, percentageSaved] }]
          // seriesData.push(consumption);
          // seriesData1.push(dataSaving);
          seriesData.push(data2);


          // highcharts = Highcharts;
          this.lineChartOptions = {
            colorCount: '4',
            colors: ['#90ED7D', '#ff7a01', '#7cb5ec', '#058DC7'],
            chart: {
              type: "spline",
              backgroundColor: "#222222",

              overflow: 'scroll'
            },
            title: {
              style: {
                color: 'white',
              },
              text: 'Snapshot Monthly Trend'
            },
            credits: {
              enabled: false
            },
            xAxis: {
              labels: {
                style: {
                  color: 'white',
                },
              },
              categories: response['months']
            },
            // yAxis: {
            //   title: {
            //     style: {color:'white',},
            //     text: "Value"
            //   },
            //   labels : {
            //     style: {
            //       color:'white'
            //     }
            //   }
            // },

            yAxis: [{ // Primary yAxis
              labels: {
                // format: '{value} units',
                style: {
                  color: '#ff7a01'
                }
              },
              title: {
                text: 'Units (KWH)',
                style: {
                  color: '#ff7a01'
                }
              },
              opposite: false

            }, { // Secondary yAxis
              gridLineWidth: 0,
              title: {
                text: 'Percentage Saved',
                style: {
                  color: '#7cb5ec'
                }
              },
              labels: {
                format: '{value} %',
                style: {
                  color: '#7cb5ec'
                }

              },
              opposite: true

            }],



            tooltip: {
              formatter: function () {
                let date = new Date().toLocaleDateString("en-US", { month: 'short' }) + '-' + new Date().getFullYear().toString();
                if (date == this.x) {
                  var d = new Date(); // today!
                  d.setDate(d.getDate() - 1);
                  return '<b>' + 'till' + ' ' + d.getDate().toString() + '-' + new Date().toLocaleDateString("en-US", { month: 'short' }) + '-' + new Date().getFullYear().toString() + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>'
                }
                return '<b>' + this.x + '</b><br/>' +
                  this.series.name + ': ' + this.y + '<br/>'

              }
            },
            legend: {
              itemStyle: { color: 'white', },
            },
            series: [

              {
                name: 'Energy Consumed',
                data: response['energyConsumed'],


              },
              {
                name: 'Energy Saved',
                data: response["energySaved"],


              },
              {
                yAxis: 1,
                name: 'Percentage Saved',
                data: response["percentageSaved"],

              }
            ]
          }
          console.log("graph data", this.lineChartOptions)
          this.trendChartLoading = false;
        });

    }


  }


  openSiteDashboard() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    this.dialog.open(DialogSwitchdashComponent, dialogConfig);

  }
  lightsData() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(LightsWattDataComponent, dialogConfig);

  }
  fansData() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(FanswattdataComponent, dialogConfig);

  }
  avgData() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    this.dialog.open(AvgDataComponent, dialogConfig);

  }
  exportExcelData() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "20%";
    this.dialog.open(ExcelsheetComponent, dialogConfig);

  }



  baseline() {
    console.log("baseline html hit")
    this.DataService.changeMessage("baseline");
    localStorage.setItem('siteId', this.siteId);
    localStorage.setItem("baseline", 'true');
  }



}

export interface SiteAlarmData {
  siteid: string;
  site_name: string;
  sitetype: string;
  contact: string;
  avgsaving: string;
  min: string;
  max: string;
}

