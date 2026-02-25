
import { DataService } from './../services/data.service';
import { DataTableItem, DataTableDataSource } from '../super-admin/data-table-datasource';
import { changePassword } from './../models/changepassword';
import { DashboardDataService } from './../services/dashboard-data.service';
import { LoginComponent } from './../login/login.component';

import { UserService } from './../services/user.service';
import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-submetering',
  templateUrl: './submetering.component.html',
  styleUrls: ['./submetering.component.css'],
  standalone: false
})


export class SubmeteringComponent implements OnInit {

  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  monthlyAvg: any;
  monthdate: any;


  // highCharts = HighCharts;
  applySelectFilter(event) {
    //alert(event.value);
    //data = event.value;
  }
  intervals: KeyValueIf[] = [
    { value: '0', viewValue: 'Daily' },
    { value: '1', viewValue: 'Hourly' }
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
  dailyAvg: any;




  liveData = new LiveMeteringDataModel();
  public pieChartOptions: any;
  graphTitle: string;
  // selected_graph = '0';
  updateFlag: boolean = false;
  whichGraph = 1;
  ishide = 1;
  previous: any;
  graphShown: Boolean = true;

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


  loading = true;
  barChartOptions: any = {};
  lineChartOptions: any = {};
  updatedbarChartOptions: any = {};
  Highcharts = Highcharts;
  chartConstructor = 'chart';
  chartCallback: any;
  oneToOneFlag = true;
  pieChart = Highcharts;
  chartLoading: boolean = false;
  trendChartLoading: boolean = false;
  trendChartInst: Highcharts.Chart;
  energyChartInst: Highcharts.Chart;
  trendChartCallback: (chart: Highcharts.Chart) => void;
  energyChartCallback: (chart: Highcharts.Chart) => void;
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
  MyntraLightsOnly: boolean = false
  MyntraFansOnly: boolean = false

  // siteAlarmData = new SiteAlarmData(); 


  // This site id is just for demo purpose should be replaced by original
  // once the function is moved to customer dashboard
  siteId;
  changePasswordModel = new changePassword(this.token, '', '');

  //@ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dashData: DashboardDataService,
    private UserService: UserService,
    private DataService: DataService,
    public dialog: MatDialog,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.trendChartCallback = (chart: Highcharts.Chart) => { this.trendChartInst = chart; };
    this.energyChartCallback = (chart: Highcharts.Chart) => { this.energyChartInst = chart; };
    this.chartCallback = this.energyChartCallback;
  }

  ngOnInit() {
    this.siteId = localStorage.getItem('siteId');
    this.sitename = localStorage.getItem('sitename')

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
      this.showIntervalOptions = false
      this.customerOnly = false
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
    this.submeteringMonthlyBarChart();
    this.getMonthlyTrend();
    this.getSubmeteringSnapshot();

  }

  displayedColumns1 = ['alarm_type', 'object_type', 'alarm_priority', 'created_date'];


  //Here is define function for getting site snapshot(energy-saved, saved% etc)
  getSubmeteringSnapshot() {
    let data = { "site_id": this.siteId, "user_type": this.user_type }
    this.UserService.getSubmeteringSnapshot(data).subscribe(
      response => {
        this.alarms = response['alarms'];
        this.energyConsumed = response['energy_consumed'];
        this.dailyAvg = response['dailyAvg'];
        this.liveDate = response['live_date'];
        this.previous = response['current_date'];
        this.monthlyAvg = response['monthlyAvg'];
        this.monthdate = response['firstmnthDate'];

      });
  }

  valuechange(newValue) {
    //mymodel = newValue;
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
      catch { }
      try {
        this.updatedbarChartOptions.plotOptions.column.stacking = '';  // for hourly
      }
      catch { }
      this.updateFlag = true;
    }
    else {
      try {
        this.barChartOptions.plotOptions.column.stacking = 'normal'; // for daily
      } catch { console.log("error in daily....") }
      try {
        this.updatedbarChartOptions.plotOptions.column.stacking = 'normal'; // for hourly
      } catch { console.log("error in hourly ....") }
      this.updateFlag = true;
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
        // console.log("data : ", chartData[i])
        chartData[i].setVisible(true, false)
      }
      this.chart.chart.redraw()
    }
    else {
      this.graphShown = false
      let chartData = this.chart.chart.legend.allItems
      for (let i = 0; i <= chartData.length - 1; i++) {
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
  }
  onChangePwd() {

    this.chngpwd = { 'token': this.token, 'oldpassword': btoa(this.changePasswordModel.oldpassword), 'newpassword': btoa(this.changePasswordModel.newpassword) };
    this.UserService.changePassword(this.chngpwd).subscribe(
      data => {
        //console.log("server_Res: ", data);
      },
      error => {
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

  submeteringMonthlyBarChart() {
    this.chartLoading = true;
    let todayDate = new Date();
    let tillDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    let fromDate = formatDate(new Date().setDate(todayDate.getDate() - 30), 'yyyy/MM/dd', 'en');
    let data1 = { 'site_id': this.siteId, 'from_date': fromDate, 'till_date': tillDate, "user_type": this.user_type };
    this.UserService.submeteringMonthlyBarChart(data1).subscribe(
      response => {
        this.ngZone.runOutsideAngular(() => {
          const options = {
            colorCount: '12',
            colors: ['#90ED7D', '#ff7a01', '#7cb5ec', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
            credits: { enabled: false },
            chart: {
              backgroundColor: '#222222',
              type: 'column',
              zoomType: 'x',
              animation: false,
            },
            title: {
              text: this.graphTitle,
              style: { color: 'white' },
            },
            xAxis: {
              labels: { style: { color: 'white' } },
              categories: response['Dates']
            },
            yAxis: {
              allowDecimals: false,
              min: 0,
              title: { style: { color: 'white' }, text: 'Number of units (kWh)' },
              labels: { style: { color: 'white' } },
              stackLabels: {
                enabled: true,
                rotation: 270,
                y: -28,
                style: {
                  color: 'white',
                  fontSize: '11px',
                  verticalAlign: "top" as any,
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
                stacking: 'normal' as any,
                maxPointWidth: 50,
                animation: false
              },
              series: {
                animation: false
              }
            },
            legend: {
              itemStyle: { color: 'white' },
              maxHeight: 80,
              y: 10,
              navigation: {
                activeColor: 'white',
                animation: true,
                arrowSize: 12,
                inactiveColor: '#333',
                style: {
                  fontWeight: '2px' as any,
                  color: 'white'
                }
              }
            },
            series: response['Data']
          };

          if (this.energyChartInst) {
            this.energyChartInst.update(options as any, true, true, false);
          } else {
            this.barChartOptions = options;
          }
          this.chartLoading = false;
          this.cdr.detectChanges();
        });
      },
      error => { }
    );
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

      // console.log(`Exporting Energy Data from ${formattedFrom} to ${formattedTo}`);
      // console.log(`Site: ${this.sitename}`);

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
        this.chartLoading = true;
        let data = { 'site_id': this.siteId, 'from_date': fromDate, 'till_date': tillDate, "user_type": this.user_type };
        this.UserService.submeteringMonthlyBarChart(data).subscribe(
          response => {
            this.ngZone.runOutsideAngular(() => {
              this.showHourlygraph = false;
              this.showDailygraph = true;
              if (this.energyChartInst) {
                this.energyChartInst.update({
                  xAxis: { categories: response['Dates'] },
                  series: response['Data'],
                  plotOptions: { column: { animation: false }, series: { animation: false } }
                } as any, true, true, false);
              } else {
                this.barChartOptions.xAxis.categories = response['Dates'];
                this.barChartOptions.series = response['Data'];
              }
              this.chartLoading = false;
              this.cdr.detectChanges();
            });
          },
          error => { }
        );
      }
      else {
        // Graph Filter is for hourly data
        this.chartLoading = true;
        let data = { 'site_id': this.siteId, 'date': hourlySelectedDate };

        this.UserService.submeteringHourlyData(data).subscribe(
          response => {
            this.ngZone.runOutsideAngular(() => {
              this.showDailygraph = false;
              this.showHourlygraph = true;
              const options = {
                colorCount: '12',
                colors: ['#90ED7D', '#ff7a01', '#7cb5ec', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                credits: { enabled: false },
                chart: {
                  type: "column",
                  backgroundColor: "#222222",
                  zoomType: 'x',
                  animation: false
                },
                title: {
                  text: this.graphTitle,
                  style: { color: 'white' },
                },
                xAxis: {
                  labels: { style: { color: 'white' } },
                  categories: response['Hours']
                },
                yAxis: {
                  allowDecimals: false,
                  min: 0,
                  title: { style: { color: 'white' }, text: 'Number of units (kWh)' },
                  labels: { style: { color: 'white' } },
                  stackLabels: {
                    enabled: true,
                    rotation: 270,
                    y: -28,
                    style: {
                      color: 'white',
                      fontSize: '11px',
                      verticalAlign: "top" as any,
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
                    stacking: 'normal' as any,
                    maxPointWidth: 50,
                    animation: false
                  },
                  series: {
                    animation: false
                  }
                },
                legend: {
                  itemStyle: { color: 'white' },
                  maxHeight: 80,
                  y: 10,
                  navigation: {
                    activeColor: 'white',
                    animation: true,
                    arrowSize: 12,
                    inactiveColor: '#333',
                    style: {
                      fontWeight: '2px' as any,
                      color: 'white'
                    }
                  }
                },
                series: response["Data"],
              };

              if (this.energyChartInst) {
                this.energyChartInst.update(options as any, true, true, false);
              } else {
                this.updatedbarChartOptions = options;
              }
              this.chartLoading = false;
              this.cdr.detectChanges();
            });
          },
          error => { }
        );
      }
    }
    else {
      // Graph for energy saving data ....
      if (mode == '0') {
        // Graph Filter is for daily data
        this.chartLoading = true;
        let data = { 'site_id': this.siteId, 'from_date': fromDate, 'till_date': tillDate, "user_type": this.user_type };
        this.UserService.energySavingMonthlyData(data).subscribe(
          response => {
            this.ngZone.runOutsideAngular(() => {
              this.showDailygraph = true;
              this.showHourlygraph = false;
              if (this.energyChartInst) {
                this.energyChartInst.update({
                  xAxis: { categories: response['Dates'] },
                  series: response['SavingData'],
                  plotOptions: { column: { animation: false }, series: { animation: false } }
                } as any, true, true, false);
              } else {
                this.barChartOptions.xAxis.categories = response['Dates'];
                this.barChartOptions.series = response['SavingData'];
              }
              this.chartLoading = false;
              this.cdr.detectChanges();
            });
          },
          error => { }
        );
      }
      else {
        this.chartLoading = true;
        let data = { 'site_id': this.siteId, 'date': hourlySelectedDate };
        this.UserService.energySavingHourlyData(data).subscribe(
          response => {
            this.ngZone.runOutsideAngular(() => {
              this.showDailygraph = false;
              this.showHourlygraph = true;
              if (this.energyChartInst) {
                this.energyChartInst.update({
                  xAxis: { categories: response['Hours'] },
                  series: response['SavingData'],
                  plotOptions: { column: { animation: false }, series: { animation: false } }
                } as any, true, true, false);
              } else {
                this.updatedbarChartOptions.xAxis.categories = response['Hours'];
                this.updatedbarChartOptions.series = response['SavingData'];
              }
              this.chartLoading = false;
              this.cdr.detectChanges();
            });
          },
          error => { }
        );
      }
    }
  }







  //Call function for monthly trend Graph.....
  getMonthlyTrend() {
    this.trendChartLoading = true;
    let data1 = { 'site_id': this.siteId, "user_type": this.user_type };
    this.UserService.subMeteringMonthlyTrend(data1).subscribe(
      response => {
        this.ngZone.runOutsideAngular(() => {
          const options = {
            colorCount: '4',
            colors: ['#90ED7D', '#ff7a01', '#7cb5ec', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
            chart: {
              backgroundColor: '#222222',
              type: 'spline',
              zoomType: 'x',
              animation: false,
              overflow: 'scroll'
            },
            title: {
              style: { color: 'white' },
              text: 'Monthly Trend'
            },
            credits: { enabled: false },
            xAxis: {
              labels: { style: { color: 'white' } },
              categories: response['months']
            },
            yAxis: [{ // Primary yAxis
              labels: { style: { color: '#ff7a01' } },
              title: { text: 'Units (KWH)', style: { color: '#ff7a01' } },
              opposite: false
            }, { // Secondary yAxis
              gridLineWidth: 0,
              title: { text: 'Monthly Avg', style: { color: '#90ED7D' } },
              labels: { style: { color: '#90ED7D' } },
              opposite: true
            }],
            plotOptions: {
              column: {
                stacking: 'normal' as any,
                maxPointWidth: 50,
                animation: false
              },
              series: {
                animation: false
              }
            },
            tooltip: {
              formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                  this.series.name + ': ' + this.y + '<br/>' +
                  'Total: ' + this.point.stackTotal;
              }
            },
            legend: { itemStyle: { color: 'white' } },
            series: response['unit_consumed_data'],
          };

          if (this.trendChartInst) {
            this.trendChartInst.update(options as any, true, true, false);
          } else {
            this.lineChartOptions = options;
          }
          this.trendChartLoading = false;
          this.cdr.detectChanges();
        });
      },
      error => { }
    );
  }

  exportExcelData() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "20%";
    this.dialog.open(ExcelsheetComponent, dialogConfig);
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


