import { Validators } from '@angular/forms';
//import { PieGraphComponent } from './../pie-graph/pie-graph.component';
import { SiteDetailsModel, LiveMeteringDataModel } from './../models/siteDataModel';
import { DataService } from './../services/data.service';
import { DataTableItem, DataTableDataSource } from '../super-admin/data-table-datasource';
import { changePassword } from './../models/changepassword';
import { DashboardDataService } from './../services/dashboard-data.service';
import { LoginComponent } from './../login/login.component';

import { UserService } from './../services/user.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import * as Highcharts from 'highcharts';
import { NgZone, ChangeDetectorRef } from '@angular/core';

// Set Highcharts to use local time instead of UTC
Highcharts.setOptions({
    time: {
        useUTC: false
    }
});
//import {MatPaginator} from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { UntypedFormControl } from '@angular/forms';
import { Observable, from, interval } from 'rxjs';
import { formatDate, getLocaleDayNames } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { DialogSwitchdashComponent } from '../dialog-switchdash/dialog-switchdash.component';
import { chart } from 'highcharts';
import * as solidGauge from 'highcharts/modules/solid-gauge.src';
import { ExcelsheetComponent } from '../excelsheet/excelsheet.component';
import { PfTableComponent } from '../pf-table/pf-table.component';
import { LightsWattDataComponent } from '../lights-watt-data/lights-watt-data.component';
import { LoadDataTableComponent } from '../load-data-table/load-data-table.component';
import { CustomDateRangePickerComponent } from '../custom-date-range-picker/custom-date-range-picker.component';
import { DgFuelExcelExportComponent } from '../dg-fuel-excel-export/dg-fuel-excel-export.component';
import { LoadGraphExcelExportComponent } from '../load-graph-excel-export/load-graph-excel-export.component';


export interface KeyValueIf {
    value: string;
    viewValue: string;
}


@Component({
    selector: 'app-wh-metering',
    templateUrl: './wh-metering.component.html',
    styleUrls: ['./wh-metering.component.css']
    //providers:[PieGraphComponent]
    ,
    standalone: false
})
export class WhMeteringComponent implements OnInit {

    myObj = JSON.parse(localStorage.getItem("account"));
    siteId = localStorage.getItem('siteId');
    user_id = this.myObj["id"];
    user_type = this.myObj["UserType"];
    minDate = new Date(2000, 0, 1);
    maxDate = new Date();
    dgfuelMinDate = new Date(2023, 3, 6)
    totalLoad: any;
    supply_source = "";
    // highCharts = HighCharts;
    applySelectFilter(event) {
        //alert(event.value);
        //data = event.value;
    }
    selected_load_options = "0";
    loadGraphintervals: KeyValueIf[] = [
        { value: '0', viewValue: 'DateWise' },
        { value: '1', viewValue: 'Daily' },
        { value: '2', viewValue: 'Monthly' },
        { value: '3', viewValue: 'Mains &DG' },
        { value: '4', viewValue: 'Live Data' },

    ];

    intervals: KeyValueIf[] = [
        { value: '0', viewValue: 'Daily' },
        { value: '1', viewValue: 'Hourly' }
    ];

    graphTypes: any = [
        { value: '0', viewValue: 'Energy Consumption' },
        { value: '1', viewValue: 'Mains/DG Run Percentage(Unit)' }
    ];

    selected_graph = '0';
    selected_task = '0';
    date = new UntypedFormControl(new Date());
    loadDate = new UntypedFormControl(new Date());
    dgFuelDate = new UntypedFormControl(new Date());
    serializedDate = new UntypedFormControl((new Date()).toISOString().substring(0, 10));
    whichGraph = 1;
    loadGraph: Boolean = true;
    seprateManinsDgLoad: Boolean = false;
    filterDate: string;
    picker1: Date;
    picker2: Date;


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
    dates: object[];
    myData: object[];
    show_dg_mains_run_time: any;
    liveData = new LiveMeteringDataModel();
    loading = true;
    updateFlag: boolean = false;
    updateLoadDataFlag: boolean = false;
    Highcharts = Highcharts;
    chartConstructor = 'chart';
    chartCallback: any;
    oneToOneFlag = true;
    pieChart = Highcharts;
    public pieChartOptions: any = {};
    barChartOptions: any = {};
    runTimeGraph: boolean = false
    graphTitle: string;
    graphYAxis: string;
    changePasswordModel = new changePassword(this.token, '', '');
    siteDetails = new SiteDetailsModel();
    dgFuelData: boolean = false;
    dgFuelConsumptionOptions: any = {};
    dgFuelDataSelectionChange: boolean = false;
    dgFuelConsumptionSelectionOptions: any = {};
    showFuelGraph: boolean = false;
    site_dash = false;
    customer_home = false;
    super_admin_home = false;
    customer_name = false;
    Admindata = false;
    infoToken; //variable decalration for token verfication
    sessionVerify; //for session verification
    baselineVisibility: boolean = false;
    showIntervalOptions: boolean = false;
    showLoadIntervalOptions: boolean = false;
    // pf_visible: boolean = false;
    pf_visible: any = localStorage.getItem('pf_visible');
    is_load_graph_visible: any = localStorage.getItem("is_load_graph_visible");
    dg_fuel_system_installed: any = localStorage.getItem("dg_fuel_system_installed");
    customer_visible_dg_fuel_data: any = localStorage.getItem("customer_visible_dg_fuel_data")
    is_hourly_data_visible: any = localStorage.getItem("is_hourly_data_visible")
    liveLoadApiCal: Boolean = false;
    lineChartOptions: any = {};
    lineChartOption: any = {};
    seprateManinsDgLoadChartOptions: any = {};
    // Highcharts = Highcharts;
    chartLoading: boolean = true;
    pieChartLoading: boolean = true;
    barChartLoading: boolean = true;
    loadGraphLoading: boolean = true;
    dgFuelChartLoading: boolean = false;
    energyExportLoading: boolean = false;
    dgFuelExportLoading: boolean = false;
    @ViewChild('chart') chart;
    @ViewChild("loadChart") loadChart;

    pieChartInst: Highcharts.Chart;
    dgFuelChartInst: Highcharts.Chart;
    loadChartInst: Highcharts.Chart;
    trendChartInst: Highcharts.Chart;
    energyChartInst: Highcharts.Chart;

    pieChartCallback: any;
    dgFuelChartCallback: any;
    loadChartCallback: any;
    trendChartCallback: any;
    energyChartCallback: any;

    //@ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private dashData: DashboardDataService,
        private UserService: UserService,
        private DataService: DataService,
        private user_service: UserService,
        private router: Router,
        public dialog: MatDialog,
        private ngZone: NgZone,
        private cdr: ChangeDetectorRef
    ) {
        this.pieChartCallback = (chart: Highcharts.Chart) => { this.pieChartInst = chart; };
        this.dgFuelChartCallback = (chart: Highcharts.Chart) => { this.dgFuelChartInst = chart; };
        this.loadChartCallback = (chart: Highcharts.Chart) => { this.loadChartInst = chart; };
        this.trendChartCallback = (chart: Highcharts.Chart) => { this.trendChartInst = chart; };
        this.energyChartCallback = (chart: Highcharts.Chart) => { this.energyChartInst = chart; };
        this.chartCallback = this.trendChartCallback;
        this.show_dg_mains_run_time = localStorage.getItem('show_dg_mains_run_time');
        if (this.show_dg_mains_run_time == "true") {
            this.graphTypes = [
                { value: '0', viewValue: 'Energy Consumption' },
                { value: '1', viewValue: 'Mains/DG Run Percentage(Unit)' },
                { value: '2', viewValue: 'Mains/DG Run Percentage(Time)' }
            ];
        }


    }

    ngOnInit() {
        if (this.pf_visible == "true") {
            this.pf_visible = true;
        } else {
            this.pf_visible = false
        }
        //here is implementation of breadceumb...
        if (this.user_type == '1') {
            this.super_admin_home = true
            this.customer_home = false
            this.customer_name = true //false
            this.site_dash = true
            this.Admindata = true
            this.showIntervalOptions = true
            this.showLoadIntervalOptions = true;
        }
        else if (this.user_type == '4' || this.user_type == '5') {
            this.super_admin_home = false
            this.customer_home = true
            this.customer_name = false
            this.site_dash = true
            this.Admindata = false
            this.showLoadIntervalOptions = true;
            if (this.is_hourly_data_visible == 'true') {
                this.showIntervalOptions = true
            } else {
                this.showIntervalOptions = false;
            }

        }
        else {
            this.super_admin_home = false
            this.customer_home = true
            this.customer_name = false
            this.site_dash = true
            this.Admindata = false
        }


        /**
         * These functions need to be called whenever the page is loaded
         */
        // Get Site Details
        this.getSiteDetails();
        // Live data to be fetched every 5 sec
        this.getSiteCurrLoadInfoData();
        this.dgFuelMonthlyTrend();


        // Get Power source distribution data
        this.getPowerSourceDistData();
        // Highcharts.chart('chartcontainer',this.barChartOptions);
        this.isShown = true;
        if (this.is_load_graph_visible == "true") {
            this.load_graph(); // this function will call for particular customer and site
        }
        if (this.dg_fuel_system_installed == 'true') {
            if (this.user_type == '1') {
                this.showFuelGraph = true
                this.dgFuelConsumptionGraph()
            }
            else if (this.customer_visible_dg_fuel_data == 'true') {
                this.showFuelGraph = true
                this.dgFuelConsumptionGraph()
            }

        }



        // Consumption Graph data
        this.getConsumptionData();

        //  if( this.updateFlag=true){
        //    this.getConsumptionData();
        //  }




    }


    ngAfterViewInit() {
        interval(15000).subscribe(
            response => {
                if (this.selected_load_options == "4" && this.liveLoadApiCal) {
                    this.load_data_every_second();
                }

            }
        );
        interval(5000).subscribe(
            response => {
                this.getSiteCurrLoadInfoData();
            });
    }

    dgFuelConsumptionGraph() {
        let todayDate = formatDate(this.dgFuelDate.value, 'yyyy/MM/dd', 'en');
        let reqData = { "site_id": this.siteId, "date": todayDate, "user_type": this.user_type }
        this.dgFuelDataSelectionChange = false;
        this.dgFuelData = true;
        this.dgFuelChartLoading = true;
        this.DataService.dgFuelConsumptionData(reqData).subscribe(
            res => {
                this.ngZone.runOutsideAngular(() => {
                    let dataSeries = res["data"]
                    if (!dataSeries || dataSeries.length === 0) {
                        const epoch_time = new Date(this.dgFuelDate.value).getTime();
                        dataSeries = [[epoch_time, 0]];
                    }

                    let refuelSeries = res["refuel_alert"] || { data: [] };
                    refuelSeries["dataLabels"] = { "enabled": true }
                    let theftSeries = res["theft_alert"] || { data: [] };
                    theftSeries["dataLabels"] = { "enabled": true }
                    let dgFuelConsumed = res["dg_fuel_data"] || { data: [] };
                    dgFuelConsumed["dataLabels"] = { "enabled": true }
                    let dgUnitPerLtr = res["dg_unit_per_litre_data"] || { data: [] };
                    dgUnitPerLtr["dataLabels"] = { "enabled": true }
                    let dgConsumptionDataSeries = res["dg_unit_data"] || { data: [] };
                    dgConsumptionDataSeries["yAxis"] = 1
                    dgConsumptionDataSeries["dataLabels"] = { "enabled": true }

                    const options = {
                        colorCount: '5',
                        colors: ['#90ED7D', '#7cb5ec', '#ff0000', '#ff7a01', '#800080', '#00008B'],
                        chart: {
                            type: "spline",
                            backgroundColor: "#222222",
                            scrollablePlotArea: {
                                minWidth: 300,
                                scrollPositionX: 1
                            },
                            animation: false,
                        },
                        navigator: { enabled: true },
                        scrollbar: { enabled: true },
                        legend: { itemStyle: { color: 'white' } },
                        xAxis: {
                            type: 'datetime',
                            dateTimeLabelFormats: { day: '%d %b %Y' },
                            startOnTick: true,
                            endOnTick: true,
                            showLastLabel: true,
                            labels: {
                                style: { color: 'white' },
                                rotation: -45,
                                format: '{value:%Y-%m-%d %H:%M}',
                            }
                        },
                        yAxis: [
                            {
                                labels: { style: { color: 'white' } },
                                title: { text: 'Fuel Level (in Litres)', style: { color: 'white' } },
                                opposite: false,
                            },
                            {
                                gridLineWidth: 0,
                                title: { text: 'Unit Consumed In KWH', style: { color: 'white' } },
                                labels: { format: '{value} KWH', style: { color: 'white' } },
                                opposite: true,
                                min: 0,
                                max: 600,
                                tickInterval: 100,
                            }
                        ],
                        time: { useUTC: false },
                        title: { text: 'DG Fuel and Unit Trend', style: { color: 'white' } },
                        plotOptions: {
                            series: { turboThreshold: 0, pointWidth: 15, animation: false }
                        },
                        series: [{
                            type: "spline",
                            name: 'Fuel Level',
                            data: dataSeries,
                            color: '#90ED7D',
                            lineWidth: 2
                        }, {
                            ...refuelSeries,
                            color: '#7cb5ec'
                        }, {
                            ...theftSeries,
                            color: '#ff0000'
                        }, {
                            ...dgConsumptionDataSeries,
                            color: '#ff7a01'
                        }, {
                            ...dgFuelConsumed,
                            color: '#800080'
                        }, {
                            ...dgUnitPerLtr,
                            color: '#00008B'
                        }]
                    };

                    if (this.dgFuelChartInst) {
                        this.dgFuelChartInst.update(options as any, true, true, false);
                    } else {
                        this.dgFuelConsumptionOptions = options;
                    }
                    this.dgFuelChartLoading = false;
                    this.cdr.detectChanges();
                });
            },
            error => {
                this.dgFuelChartLoading = false;
                this.cdr.detectChanges();
            }
        )
    }

    dgFuelConsumptionGraphSelectionChange() {
        let todayDate = formatDate(this.dgFuelDate.value, 'yyyy/MM/dd', 'en');
        let reqData = { "site_id": this.siteId, "date": todayDate, "user_type": this.user_type }
        this.dgFuelData = true;
        this.dgFuelDataSelectionChange = false;
        this.dgFuelChartLoading = true;
        this.DataService.dgFuelConsumptionData(reqData).subscribe(
            res => {
                this.ngZone.runOutsideAngular(() => {
                    let dataSeries = res["data"]
                    if (!dataSeries || dataSeries.length === 0) {
                        const epoch_time = new Date(this.dgFuelDate.value).getTime();
                        dataSeries = [[epoch_time, 0]];
                    }

                    let refuelSeries = res["refuel_alert"] || { data: [] };
                    refuelSeries["dataLabels"] = { "enabled": true }
                    let theftSeries = res["theft_alert"] || { data: [] };
                    theftSeries["dataLabels"] = { "enabled": true }
                    let dgFuelConsumed = res["dg_fuel_data"] || { data: [] };
                    dgFuelConsumed["dataLabels"] = { "enabled": true }
                    let dgUnitPerLtr = res["dg_unit_per_litre_data"] || { data: [] };
                    dgUnitPerLtr["dataLabels"] = { "enabled": true }
                    let dgConsumptionDataSeries = res["dg_unit_data"] || { data: [] };
                    dgConsumptionDataSeries["yAxis"] = 1
                    dgConsumptionDataSeries["dataLabels"] = { "enabled": true }

                    const options = {
                        colorCount: '5',
                        colors: ['#90ED7D', '#7cb5ec', '#ff0000', '#ff7a01', '#800080', '#00008B'],
                        chart: {
                            type: "spline",
                            backgroundColor: "#222222",
                            scrollablePlotArea: {
                                minWidth: 300,
                                scrollPositionX: 1
                            },
                            zoomType: "x",
                            animation: false,
                        },
                        navigator: { enabled: true },
                        scrollbar: { enabled: true },
                        legend: {
                            itemStyle: { color: 'white' },
                        },
                        xAxis: {
                            type: 'datetime',
                            dateTimeLabelFormats: {
                                day: '%d %b %Y'
                            },
                            startOnTick: true,
                            endOnTick: true,
                            showLastLabel: true,
                            labels: {
                                style: { color: 'white' },
                                rotation: -45,
                                format: '{value:%Y-%m-%d %H:%M}',
                            }
                        },
                        yAxis: [{
                            labels: {
                                style: { color: 'white' }
                            },
                            title: {
                                text: 'Fuel Level (in Litres)',
                                style: { color: 'white' }
                            },
                            opposite: false,
                        },
                        {
                            gridLineWidth: 0,
                            title: {
                                text: 'Unit Consumed In KWH',
                                style: { color: 'white' }
                            },
                            labels: {
                                format: '{value} KWH',
                                style: { color: 'white' }
                            },
                            opposite: true,
                            min: 0,
                            max: 600,
                            tickInterval: 100,
                        }
                        ],
                        time: { useUTC: false },
                        title: {
                            text: 'DG Fuel and Unit Trend',
                            style: { color: 'white' },
                        },
                        plotOptions: {
                            series: {
                                turboThreshold: 0,
                                pointWidth: 15,
                                animation: false
                            }
                        },
                        series: [{
                            type: "spline",
                            name: 'Fuel Level',
                            data: dataSeries,
                            color: '#90ED7D',
                            lineWidth: 2
                        }, {
                            ...refuelSeries,
                            color: '#7cb5ec'
                        }, {
                            ...theftSeries,
                            color: '#ff0000'
                        }, {
                            ...dgConsumptionDataSeries,
                            color: '#ff7a01'
                        }, {
                            ...dgFuelConsumed,
                            color: '#800080'
                        }, {
                            ...dgUnitPerLtr,
                            color: '#00008B'
                        }]
                    };

                    if (this.dgFuelChartInst) {
                        this.dgFuelChartInst.update(options as any, true, true, false);
                    }
                    this.dgFuelConsumptionOptions = options;
                    this.dgFuelChartLoading = false;
                    this.cdr.detectChanges();
                });
            },
            error => {
                this.dgFuelChartLoading = false;
                this.cdr.detectChanges();
            }
        )
    }


    //   lineWidth: 0,
    //   marker: {
    //       enabled: true,
    //       radius: 5
    //   },
    //   tooltip: {
    //     valueDecimals: 2
    // },
    // states: {
    //     hover: {
    //         lineWidthPlus: 0
    //     }
    // }

    verifySession() {
        this.infoToken = { "token": localStorage.getItem("token") }
        this.user_service.validateToken(this.infoToken).subscribe(
            response => {
                this.sessionVerify = response['result']
                if (this.sessionVerify == 'true') {

                }
                else {
                    // localStorage.removeItem('token');
                    localStorage.clear();
                    localStorage.removeItem('token');
                    this.router.navigate(['/login']);

                }
            }

        )
    }

    open() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "40%";
        this.dialog.open(DialogSwitchdashComponent, dialogConfig);
    }

    load_data_every_second() {
        let epoch_time = localStorage.getItem("epoch_time");
        let data = { "site_id": this.siteId, "epoch_time": epoch_time }
        this.DataService.load_graph_every_sec(data).subscribe(
            res => {
                for (let i = 0; i <= res['data'].length - 1; i++) {
                    this.loadChart.chart.series[0].addPoint(res['data'][i], true, false)
                }

                localStorage.setItem("epoch_time", res["data"].splice(-1)[0].x)
            })
    }


    load_graph() {
        let todayDate = new Date();
        let tillDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
        let fromDate = formatDate(new Date().setDate(todayDate.getDate() - 30), 'yyyy/MM/dd', 'en');
        let req_data;
        // call api for todays data
        req_data = { 'site_id': this.siteId, 'date': formatDate(new Date().setDate(todayDate.getDate()), 'yyyy/MM/dd', 'en') };
        this.DataService.hourly_load_graph(req_data).subscribe(
            res => {

                let dataSeries = res["data"]
                // console.log("api data: ", dataSeries)
                if (res["data"].length == 0) {
                    let epoch_time = new Date(this.date.value).getTime()
                    dataSeries = [[epoch_time, 0]]
                }

                this.loadGraphLoading = false;
                this.lineChartOptions = {
                    colorCount: 12,
                    colors: ['#90ED7D', '#ff7a01', '#7cb5ec', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                    chart: {
                        type: "spline",
                        backgroundColor: '#222222',
                        scrollablePlotArea: {
                            minWidth: 300,
                            scrollPositionX: 1
                        },
                        zoomType: "x",

                    },
                    navigator: {
                        enabled: true
                    },
                    scrollbar: {
                        enabled: true
                    },
                    credits: {
                        enabled: false
                    },

                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            day: '%d %b %Y'    //ex- 01 Jan 2016
                        },
                        startOnTick: true,
                        endOnTick: true,
                        showLastLabel: true,
                        labels: {
                            style: {
                                color: 'white',
                            },
                            rotation: -45,
                            //Specify the formatting of xAxis labels:
                            format: '{value:%Y-%m-%d %H:%M}',

                        }
                    },

                    yAxis: {
                        allowDecimals: false,
                        min: 0,
                        title: {
                            style: { color: 'white', },
                            text: 'Load Values(in KW)'
                        },
                        stackLabels: {
                            enabled: true,
                            rotation: -90,
                            style: { color: "white" },
                            verticalAlign: "top",
                            y: -30,
                        },


                        labels: {
                            style: {
                                color: 'white'
                            }
                        }
                    },

                    time: {
                        useUTC: false
                    },


                    title: {
                        text: 'Load data',
                        style: { color: 'white', },
                    },

                    // exporting: {
                    //     enabled: false
                    // },
                    legend: {
                        itemStyle: { color: 'white', },
                    },
                    plotOptions: {
                        series: {
                            turboThreshold: 0,
                            color: '#00FFFF',
                            animation: false
                        }
                    }, tooltip: {
                        formatter: function () {
                            return '<b>' + this.point.aisle_name + '</b><br/>' +
                                'Load: ' + this.y.toFixed(2) + ' KW<br/>' +
                                'Time: ' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x, false);
                        }
                    },



                    series: [{
                        name: 'Load Data',
                        data: dataSeries,
                    }]
                }
            }
        )
    }


    loadGraphFilterChanged() {
        this.loadGraphLoading = true;
        let selectedDate = formatDate(this.loadDate.value, 'yyyy/MM/dd', 'en');

        if (this.selected_load_options == "0") {
            this.loadGraph = true;
            this.liveLoadApiCal = false;
            this.seprateManinsDgLoad = false;
            let data = { "site_id": this.siteId, 'date': selectedDate }
            this.DataService.hourly_load_graph(data).subscribe(
                res => {
                    this.ngZone.runOutsideAngular(() => {
                        let seriesData = res["data"].length > 0 ? res["data"] : [[new Date(this.loadDate.value).getTime(), 0]];
                        if (this.loadChartInst) {
                            this.loadChartInst.update({ series: [{ data: seriesData }] } as any, true, true, false);
                        } else {
                            this.lineChartOptions.series[0].data = seriesData;
                        }
                        this.loadGraphLoading = false;
                        this.cdr.detectChanges();
                    });
                }
            )
        }
        else if (this.selected_load_options == "1" || this.selected_load_options == "2") {
            this.loadGraph = true;
            this.liveLoadApiCal = false;
            this.seprateManinsDgLoad = false;
            let data = { "site_id": this.siteId, 'date': selectedDate }
            this.DataService.daily_load_graph(data).subscribe(
                res => {
                    this.ngZone.runOutsideAngular(() => {
                        let seriesData = res["data"].length > 0 ? res["data"] : [[new Date(this.loadDate.value).getTime(), 0]];
                        if (this.loadChartInst) {
                            this.loadChartInst.update({ series: [{ data: seriesData }] } as any, true, true, false);
                        } else {
                            this.lineChartOptions.series[0].data = seriesData;
                        }
                        this.loadGraphLoading = false;
                        this.cdr.detectChanges();
                    });
                }
            )
        }
        else if (this.selected_load_options == "3") {
            this.liveLoadApiCal = false;
            this.loadGraph = false;
            this.seprateManinsDgLoad = true;
            let data = { "site_id": this.siteId, 'date': selectedDate }
            this.DataService.mains_dg_daily_load_graph(data).subscribe(
                res => {
                    this.ngZone.runOutsideAngular(() => {
                        const options = {
                            colorCount: 12,
                            colors: ['#90ED7D', '#ff7a01', '#7cb5ec', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                            chart: {
                                type: "spline",
                                backgroundColor: '#222222',
                                scrollablePlotArea: { minWidth: 300, scrollPositionX: 1 },
                                zoomType: "x",
                                animation: false,
                            },
                            navigator: { enabled: true },
                            scrollbar: { enabled: true },
                            xAxis: {
                                type: 'datetime',
                                dateTimeLabelFormats: { day: '%d %b %Y' },
                                startOnTick: true,
                                endOnTick: true,
                                showLastLabel: true,
                                labels: {
                                    style: { color: 'white' },
                                    rotation: -45,
                                    format: '{value:%Y-%m-%d %H:%M}',
                                }
                            },
                            yAxis: {
                                allowDecimals: false,
                                min: 0,
                                title: { style: { color: 'white' }, text: 'Load Values(in KW)' },
                                stackLabels: {
                                    enabled: true,
                                    rotation: -90,
                                    style: { color: "white" },
                                    verticalAlign: "top",
                                    y: -30,
                                },
                                labels: { style: { color: 'white' } }
                            },
                            time: { useUTC: false },
                            credits: { enabled: false },
                            title: { text: 'Load data', style: { color: 'white' } },
                            legend: { itemStyle: { color: 'white' } },
                            plotOptions: { series: { turboThreshold: 0 } },
                            series: res["data"].length > 0 ? res["data"] : [{ data: [[new Date(this.loadDate.value).getTime(), 0]] }]
                        };

                        if (this.loadChartInst) {
                            this.loadChartInst.update(options as any, true, true, false);
                        } else {
                            this.seprateManinsDgLoadChartOptions = options;
                        }
                        this.loadGraphLoading = false;
                        this.cdr.detectChanges();
                    });
                }
            )
        }
        else {
            let req_data = { "site_id": this.siteId }
            this.loadGraph = true;
            this.seprateManinsDgLoad = false;
            this.liveLoadApiCal = true;
            this.DataService.load_live_graph(req_data).subscribe(
                res => {
                    this.ngZone.runOutsideAngular(() => {
                        let seriesData = res["data"].length > 0 ? res["data"] : [[new Date(this.loadDate.value).getTime(), 0]];
                        if (this.loadChartInst) {
                            this.loadChartInst.update({ series: [{ data: seriesData }] } as any, true, true, false);
                        } else {
                            this.lineChartOptions.series[0].data = seriesData;
                        }
                        if (res["data"].length > 0) {
                            localStorage.setItem("epoch_time", res["data"][res["data"].length - 1].x || res["data"][res["data"].length - 1][0]);
                        }
                        this.loadGraphLoading = false;
                        this.cdr.detectChanges();
                    });
                }
            )
        }
    }


    getSiteDetails() {
        let data = { 'siteId': this.siteId };
        this.DataService.getSiteInfo(data).subscribe(
            response => {
                let siteDetails = response['site'];
                // let siteManagerDetails = siteDetails['site_manager'];
                let site_type = siteDetails['site_type']
                if (site_type == '1') {
                    site_type = 'WH METERING'
                }
                else if (site_type == '2') {
                    site_type = 'WH_ENERGY SAVING'
                }

                this.siteDetails.site_id = siteDetails['id'];
                this.siteDetails.site_name = siteDetails['site_name'];
                this.siteDetails.site_addr = siteDetails['location'];
                this.siteDetails.site_type = site_type;
                this.siteDetails.site_mgr_name = siteDetails['site_manager'];
                this.siteDetails.site_mgr_mob = siteDetails['site_manager_contact'];
                this.siteDetails.site_mgr_email = siteDetails['site_manager_email'];
                this.siteDetails.total_blocks = siteDetails['total_no_of_blocks'];
                this.siteDetails.total_aisles = siteDetails['total_no_of_aisles'];
                this.siteDetails.total_single_src_meters = siteDetails['no_of_single_source_meters'];
                this.siteDetails.total_dual_src_meters = siteDetails['no_of_dual_source_meters'];
            },
            error => { }
        );
    }


    getPowerSourceDistData() {
        this.pieChartLoading = true;
        let data = { 'siteId': this.siteId };
        this.DataService.getPowerSrcDistData(data).subscribe(
            response => {
                this.ngZone.runOutsideAngular(() => {
                    let status = response['result'];
                    let seriesData = [];
                    let currentMonth = response['current_month'];

                    if (status == "1") {
                        for (let k = 0; k < response['data'].length; k++) {
                            seriesData.push({ 'name': response['data'][k]['name'], 'y': response['data'][k]['data'] });
                        }
                    }

                    const options = {
                        colorCount: '12',
                        colors: ['#90ED7D', '#ff7a01', '#7cb5ec', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                        chart: {
                            type: 'pie',
                            backgroundColor: '#222222',
                            options3d: { enabled: true, alpha: 45, beta: 0 }
                        },
                        credits: { enabled: false },
                        title: {
                            style: { color: 'white' },
                            text: 'Power Source Distribution ( ' + currentMonth + ' )'
                        },
                        tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                depth: 35,
                                dataLabels: {
                                    style: { color: 'white', fontSize: '12' },
                                    enabled: true,
                                    format: '{point.name}: <b>{point.percentage:.1f}%</b>'
                                }
                            }
                        },
                        series: [{
                            type: 'pie',
                            name: 'share',
                            data: seriesData
                        }]
                    };

                    if (this.pieChartInst) {
                        this.pieChartInst.update(options as any, true, true, false);
                    } else {
                        this.pieChartOptions = options;
                    }
                    this.pieChartLoading = false;
                    this.cdr.detectChanges();
                });
            },
            error => { }
        );
    }

    getConsumptionData() {
        let todayDate = new Date();
        let tillDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
        let fromDate = formatDate(new Date().setDate(todayDate.getDate() - 30), 'yyyy/MM/dd', 'en');
        let data1 = { 'site_id': this.siteId, 'from_date': fromDate, 'till_date': tillDate };
        this.DataService.getGraphData(data1).subscribe(
            response => {
                this.ngZone.runOutsideAngular(() => {
                    const options = {
                        colorCount: '12',
                        colors: ['#90ED7D', '#ff7a01', '#7cb5ec', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                        credits: { enabled: false },
                        chart: {
                            backgroundColor: '#222222',
                            type: 'column',
                            zoomType: "x",
                            animation: false
                        },
                        title: {
                            text: this.graphTitle,
                            style: { color: 'white' }
                        },
                        xAxis: {
                            labels: { style: { color: 'white' } },
                            categories: response['Dates']
                        },
                        yAxis: {
                            allowDecimals: false,
                            min: 0,
                            title: {
                                style: { color: 'white' },
                                text: 'Number of units (kWh)'
                            },
                            stackLabels: {
                                enabled: true,
                                rotation: -90,
                                style: { color: "white" },
                                verticalAlign: "top",
                                y: -30,
                            },
                            labels: { style: { color: 'white' } }
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
                                animation: false
                            },
                            series: {
                                animation: false
                            }
                        },
                        legend: { itemStyle: { color: 'white' } },
                        series: response['Data']
                    };

                    if (this.energyChartInst) {
                        this.energyChartInst.update(options as any, true, true, false);
                    } else {
                        this.barChartOptions = options;
                        this.updateFlag = true;
                    }
                    this.barChartLoading = false;
                    this.cdr.detectChanges();
                });
            });
    }

    onChange(value) {
    }

    // Energy Export Modal Properties (Total Energy Consumption)
    showEnergyExportModal: boolean = false;
    energyExportStartDate: Date;
    energyExportEndDate: Date;

    // DG Fuel Custom Range Modal Properties
    showDgFuelCustomRangeModal: boolean = false;
    dgFuelCustomRangeStartDate: Date;
    dgFuelCustomRangeEndDate: Date;

    // DG Fuel Export Modal Properties
    showDgFuelExportModal: boolean = false;
    dgFuelExportStartDate: Date;
    dgFuelExportEndDate: Date;

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

            let data = {
                "user_id": this.user_id,
                "user_type": this.user_type,
                "site_id": this.siteId,
                "from_date": formattedFrom,
                "end_date": formattedTo,
            }

            this.energyExportLoading = true;
            this.DataService.excelDataValue(data).subscribe(
                (response: any) => {
                    this.downloadFile(response);
                    this.energyExportLoading = false;

                    const msg = `Download Successful! ${this.siteDetails.site_name} Energy Saving (${formattedFrom} - ${formattedTo})`;
                    this.DataService.showCustomSuccess(msg);

                    this.closeEnergyExportModal();
                },
                error => {
                    this.energyExportLoading = false;
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

    // ── DG Fuel Custom Range Modal ──────────────────────────────────
    openDgFuelCustomRangeModal() {
        this.showDgFuelCustomRangeModal = true;
        const today = new Date();
        this.dgFuelCustomRangeEndDate = new Date(today);
        this.dgFuelCustomRangeStartDate = new Date(today);
        this.dgFuelCustomRangeStartDate.setDate(today.getDate() - 30);
    }

    closeDgFuelCustomRangeModal() {
        this.showDgFuelCustomRangeModal = false;
    }

    submitDgFuelCustomRange() {
        if (this.dgFuelCustomRangeStartDate && this.dgFuelCustomRangeEndDate) {
            this.dgFuelChartLoading = true;
            const start_date = formatDate(this.dgFuelCustomRangeStartDate, 'yyyy-MM-dd', 'en');
            const end_date = formatDate(this.dgFuelCustomRangeEndDate, 'yyyy-MM-dd', 'en');
            const reqData = { "site_id": this.siteId, "from_date": start_date, "end_date": end_date };
            this.DataService.fetchDGFuelDataCustomeRange(reqData).subscribe(
                res => {
                    this.ngZone.runOutsideAngular(() => {
                        this.dgFuelData = true;
                        this.dgFuelDataSelectionChange = false;

                        let dataSeries = res["data"];
                        if (!dataSeries || dataSeries.length === 0) {
                            const epoch_time = new Date(this.dgFuelCustomRangeStartDate).getTime();
                            dataSeries = [[epoch_time, 0]];
                        }

                        let refuelSeries = res["refuel_alert"] || { data: [] };
                        refuelSeries["dataLabels"] = { "enabled": true };
                        let theftSeries = res["theft_alert"] || { data: [] };
                        theftSeries["dataLabels"] = { "enabled": true };
                        let dgFuelConsumed = res["dg_fuel_data"] || { data: [] };
                        let dgUnitPerLtr = res["dg_unit_per_litre_data"] || { data: [] };
                        let dgConsumptionDataSeries = res["dg_unit_data"] || { data: [] };
                        dgConsumptionDataSeries["yAxis"] = 1;
                        dgConsumptionDataSeries["dataLabels"] = { "enabled": true };

                        const options = {
                            colorCount: '5',
                            colors: ['#90ED7D', '#7cb5ec', '#ff0000', '#ff7a01', '#800080', '#00008B'],
                            chart: {
                                type: "spline",
                                backgroundColor: "#222222",
                                scrollablePlotArea: { minWidth: 300, scrollPositionX: 1 },
                                zoomType: "x",
                                animation: false
                            },
                            navigator: { enabled: true },
                            scrollbar: { enabled: true },
                            legend: { itemStyle: { color: 'white' } },
                            xAxis: {
                                type: 'datetime',
                                dateTimeLabelFormats: { day: '%d %b %Y' },
                                startOnTick: true,
                                endOnTick: true,
                                showLastLabel: true,
                                labels: {
                                    style: { color: 'white' },
                                    rotation: -45,
                                    format: '{value:%Y-%m-%d %H:%M}',
                                }
                            },
                            yAxis: [{
                                labels: { style: { color: 'white' } },
                                title: { text: 'Fuel Level (in Litres)', style: { color: 'white' } },
                                opposite: false,
                            }, {
                                gridLineWidth: 0,
                                title: { text: 'Unit Consumed In KWH', style: { color: 'white' } },
                                labels: { format: '{value} KWH', style: { color: 'white' } },
                                opposite: true,
                                min: 0,
                                max: 600,
                                tickInterval: 100,
                            }],
                            time: { useUTC: false },
                            title: { text: 'DG Fuel and Unit Trend', style: { color: 'white' } },
                            credits: { enabled: false },
                            plotOptions: {
                                series: { turboThreshold: 0, pointWidth: 15, animation: false },
                                spline: { animation: false },
                                areaspline: { animation: false }
                            },
                            series: [{
                                type: "spline",
                                name: 'Fuel Level',
                                color: '#90ED7D',
                                data: dataSeries,
                                lineWidth: 2
                            }, {
                                ...refuelSeries,
                                color: '#7cb5ec'
                            }, {
                                ...theftSeries,
                                color: '#ff0000'
                            }, {
                                ...dgConsumptionDataSeries,
                                color: '#ff7a01'
                            }, {
                                ...dgFuelConsumed,
                                color: '#800080'
                            }, {
                                ...dgUnitPerLtr,
                                color: '#00008B'
                            }]
                        };

                        if (this.dgFuelChartInst) {
                            this.dgFuelChartInst.update(options as any, true, true, false);
                        }
                        this.dgFuelConsumptionOptions = options;
                        this.dgFuelChartLoading = false;
                        this.cdr.detectChanges();
                    });
                },
                error => {
                    this.dgFuelChartLoading = false;
                    this.cdr.detectChanges();
                }
            );
            this.closeDgFuelCustomRangeModal();
        }
    }

    // ── DG Fuel Export Excel Modal ──────────────────────────────────
    openDgFuelExportModal() {
        this.showDgFuelExportModal = true;
        const today = new Date();
        this.dgFuelExportEndDate = new Date(today);
        this.dgFuelExportStartDate = new Date(today);
        this.dgFuelExportStartDate.setDate(today.getDate() - 30);
    }

    closeDgFuelExportModal() {
        this.showDgFuelExportModal = false;
    }

    submitDgFuelExport() {
        if (this.dgFuelExportStartDate && this.dgFuelExportEndDate) {
            const start_date = formatDate(this.dgFuelExportStartDate, 'yyyy-MM-dd', 'en');
            const end_date = formatDate(this.dgFuelExportEndDate, 'yyyy-MM-dd', 'en');
            const data = { "site_id": this.siteId, "start_date": start_date, "end_date": end_date };
            this.dgFuelExportLoading = true;
            this.DataService.dgFuelExcelExport(data).subscribe(
                (response: any) => {
                    let date = new Date().getDate().toString() + '-' + new Date().toLocaleDateString("en-US", { month: 'short' }) + '-' + new Date().getFullYear().toString();
                    let blob: Blob = response.body as Blob;
                    var downloadURL = window.URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = ("Report DG Fuel & Unit Trend_" + date + ".xlsx");
                    link.click();
                    this.dgFuelExportLoading = false;

                    const msg = `Download Successful! ${this.siteDetails.site_name} DG Fuel Report (${start_date} - ${end_date})`;
                    this.DataService.showCustomSuccess(msg);

                    this.closeDgFuelExportModal();
                },
                error => {
                    this.dgFuelExportLoading = false;
                    console.error("Error exporting DG fuel data", error);
                }
            );
        }
    }

    columnGraphFilterChanged(interval) {
        this.barChartLoading = true;
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

                // Call the API with specific data
                let data = { 'site_id': this.siteId, 'from_date': fromDate, 'till_date': tillDate };
                this.DataService.getGraphData(data).subscribe(
                    response => {
                        this.ngZone.runOutsideAngular(() => {
                            if (this.energyChartInst) {
                                this.energyChartInst.update({
                                    xAxis: { categories: response['Dates'] },
                                    series: response['Data'],
                                    plotOptions: { column: { animation: false }, series: { animation: false } }
                                } as any, true, true, false);
                            } else {
                                this.barChartOptions.xAxis.categories = response['Dates'];
                                this.barChartOptions.series = response['Data'];
                                this.updateFlag = true;
                            }
                            this.barChartLoading = false;
                            this.cdr.detectChanges();
                        });
                    },
                    error => { }
                );
            }
            else {
                // Graph Filter is for hourly data
                let data = { 'site_id': this.siteId, 'date': hourlySelectedDate };
                // this.barChartOptions.plotOptions.column.stacking='percent';

                this.DataService.getSiteHourlyConsumptionData(data).subscribe(
                    response => {
                        this.ngZone.runOutsideAngular(() => {
                            if (this.energyChartInst) {
                                this.energyChartInst.update({
                                    xAxis: { categories: response['Hours'] },
                                    series: response['Data'],
                                    plotOptions: { column: { animation: false }, series: { animation: false } }
                                } as any, true, true, false);
                            } else {
                                this.barChartOptions.xAxis.categories = response['Hours'];
                                this.barChartOptions.series = response['Data'];
                                this.updateFlag = true;
                            }
                            this.barChartLoading = false;
                            this.cdr.detectChanges();
                        });
                    },
                    error => { }
                );
            }


        }
        else if (graphType == "1") {
            // Percentage Run Graph

            if (mode == '0') {
                // Graph Filter is for daily data

                // Call the API with specific data
                let data = { 'site_id': this.siteId, 'from_date': fromDate, 'till_date': tillDate };
                //this.barChartOptions.plotOptions.column.stacking='percent'; //mandeep for percentage show
                this.DataService.getDailyPowerSrcDistData(data).subscribe(
                    response => {
                        this.ngZone.runOutsideAngular(() => {
                            if (this.energyChartInst) {
                                this.energyChartInst.update({
                                    xAxis: { categories: response['Dates'] },
                                    series: response['Data'],
                                    yAxis: { title: { text: "Number of units % (KWh)" } },
                                    plotOptions: { column: { animation: false }, series: { animation: false } }
                                } as any, true, true, false);
                            } else {
                                this.barChartOptions.xAxis.categories = response['Dates'];
                                this.barChartOptions.series = response['Data'];
                                this.barChartOptions.yAxis.title.text = "Number of units % (KWh)"
                                this.updateFlag = true;
                            }
                            this.barChartLoading = false;
                            this.cdr.detectChanges();
                        });
                    },
                    error => { }
                );
            }
            else {
                // Graph Filter is for hourly data
                let data = { 'site_id': this.siteId, 'date': hourlySelectedDate };
                this.DataService.getHourlyPowerSrcDistData(data).subscribe(
                    response => {
                        this.ngZone.runOutsideAngular(() => {
                            if (this.energyChartInst) {
                                this.energyChartInst.update({
                                    xAxis: { categories: response['Hours'] },
                                    series: response['Data'],
                                    plotOptions: { column: { animation: false }, series: { animation: false } }
                                } as any, true, true, false);
                            } else {
                                this.barChartOptions.xAxis.categories = response['Hours'];
                                this.barChartOptions.series = response['Data'];
                                this.updateFlag = true;
                            }
                            this.barChartLoading = false;
                            this.cdr.detectChanges();
                        });
                    },
                    error => { }
                );
            }


        }

        else {
            // Percentage Run Graph (Time)
            if (mode == '0') {
                // Graph Filter is for daily data

                // Call the API with specific data
                let data = { 'site_id': this.siteId, 'from_date': fromDate, 'till_date': tillDate };
                //this.barChartOptions.plotOptions.column.stacking='percent'; //mandeep for percentage show
                this.DataService.getDailyPowerSrcDistDataTime(data).subscribe(
                    response => {
                        this.ngZone.runOutsideAngular(() => {
                            const options = {
                                colorCount: '12',
                                colors: ['#90ED7D', '#ff7a01', '#7cb5ec', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                                credits: { enabled: false },
                                chart: {
                                    backgroundColor: '#222222',
                                    type: 'column',
                                    zoomType: "x",
                                    animation: false
                                },
                                title: {
                                    text: this.graphTitle,
                                    style: { color: 'white' }
                                },
                                xAxis: {
                                    labels: { style: { color: 'white' } },
                                    categories: response['Dates']
                                },
                                yAxis: {
                                    allowDecimals: false,
                                    min: 0,
                                    title: {
                                        style: { color: 'white' },
                                        text: 'Time (In Seconds)'
                                    },
                                    stackLabels: {
                                        enabled: true,
                                        rotation: -90,
                                        style: { color: "white" },
                                        verticalAlign: "top",
                                        y: -30,
                                    },
                                    labels: { style: { color: 'white' } }
                                },
                                tooltip: {
                                    formatter: function () {
                                        var totalMinutes = Math.floor(this.y / 60);
                                        var seconds = this.y % 60;
                                        var hours = Math.floor(totalMinutes / 60);
                                        var minutes = totalMinutes % 60;
                                        var y = hours + " hrs " + minutes + " min " + seconds + " sec";
                                        var tm = Math.floor(this.point.stackTotal / 60);
                                        var ss = this.point.stackTotal % 60;
                                        var hrs = Math.floor(tm / 60);
                                        var ms = tm % 60;
                                        var total = hrs + " hrs " + ms + " min " + ss + " sec";
                                        return '<b>' + this.x + '</b><br/>' +
                                            this.series.name + ': ' + y + '<br/>' +
                                            'Total: ' + total;
                                    }
                                },
                                plotOptions: {
                                    column: {
                                        stacking: 'normal' as any,
                                        animation: false
                                    },
                                    series: { animation: false }
                                },
                                legend: { itemStyle: { color: 'white' } },
                                series: response['Data']
                            };

                            if (this.energyChartInst) {
                                this.energyChartInst.update(options as any, true, true, false);
                            } else {
                                this.barChartOptions = options;
                                this.updateFlag = true;
                            }


                            this.barChartLoading = false;
                            this.cdr.detectChanges();
                        });
                    },
                    error => { }
                );
            }
            else {
                // Graph Filter is for hourly data
                let data = { 'site_id': this.siteId, 'date': hourlySelectedDate };
                this.DataService.getHourlyPowerSrcDistDataTime(data).subscribe(
                    response => {
                        this.ngZone.runOutsideAngular(() => {
                            const options = {
                                colorCount: '12',
                                colors: ['#90ED7D', '#ff7a01', '#7cb5ec', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                                credits: { enabled: false },
                                chart: {
                                    backgroundColor: '#222222',
                                    type: 'column',
                                    zoomType: "x",
                                    animation: false
                                },
                                title: {
                                    text: this.graphTitle,
                                    style: { color: 'white' }
                                },
                                xAxis: {
                                    labels: { style: { color: 'white' } },
                                    categories: response['Hours']
                                },
                                yAxis: {
                                    allowDecimals: false,
                                    min: 0,
                                    title: {
                                        style: { color: 'white' },
                                        text: 'Number of units (kWh)'
                                    },
                                    stackLabels: {
                                        enabled: true,
                                        rotation: -90,
                                        style: { color: "white" },
                                        verticalAlign: "top",
                                        y: -30,
                                    },
                                    labels: { style: { color: 'white' } }
                                },
                                tooltip: {
                                    formatter: function () {
                                        var totalMinutes = Math.floor(this.y / 60);
                                        var seconds = this.y % 60;
                                        var hours = Math.floor(totalMinutes / 60);
                                        var minutes = totalMinutes % 60;
                                        var y = hours + " hrs " + minutes + " min " + seconds + " sec";
                                        var tm = Math.floor(this.point.stackTotal / 60);
                                        var ss = this.point.stackTotal % 60;
                                        var hrs = Math.floor(tm / 60);
                                        var ms = tm % 60;
                                        var total = hrs + " hrs " + ms + " min " + ss + " sec";
                                        return '<b>' + this.x + '</b><br/>' +
                                            this.series.name + ': ' + y + '<br/>' +
                                            'Total: ' + total;
                                    }
                                },
                                plotOptions: {
                                    column: {
                                        stacking: 'normal' as any,
                                        animation: false
                                    },
                                    series: { animation: false }
                                },
                                legend: { itemStyle: { color: 'white' } },
                                series: response['Data']
                            };

                            if (this.energyChartInst) {
                                this.energyChartInst.update(options as any, true, true, false);
                            } else {
                                this.barChartOptions = options;
                                this.updateFlag = true;
                            }


                            this.barChartLoading = false;
                            this.cdr.detectChanges();
                        });
                    },
                    error => { }
                );
            }
        }
    }

    changeGraphStacking() {
        this.whichGraph ^= 0x1;
        const stacking = this.whichGraph == 0 ? '' : 'normal';

        if (this.energyChartInst) {
            this.energyChartInst.update({
                plotOptions: { column: { stacking: stacking as any } }
            } as any, true, false, false);
        } else {
            this.barChartOptions.plotOptions.column.stacking = stacking;
            this.updateFlag = true;
        }
    }

    openSiteDashboard() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "40%";
        this.dialog.open(DialogSwitchdashComponent, dialogConfig);
    }
    loadDetails() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "60%";
        this.dialog.open(LoadDataTableComponent, dialogConfig);

    }

    exportExcelData() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "20%";
        this.dialog.open(ExcelsheetComponent, dialogConfig);
    }

    exportDgFuelExcelData() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "20%";
        this.dialog.open(DgFuelExcelExportComponent, dialogConfig);
    }

    exportLoadData(type: string = '2') {
        if (this.selected_load_options == '0' || this.selected_load_options == '1' || this.selected_load_options == '4') {
            const selectedDate = formatDate(this.loadDate.value, 'yyyy/MM/dd', 'en');
            let data = {
                "site_id": this.siteId,
                "date": selectedDate,
                "graph_type": this.selected_load_options
            };
            this.DataService.showLoader();
            this.DataService.download_excel_load_data(data).subscribe(
                (response: any) => {
                    let blob: Blob = response.body as Blob;
                    var downloadURL = window.URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = ("load_data_" + selectedDate + ".csv");
                    link.click();
                    this.DataService.hideLoader();
                    this.DataService.success("Report Downloaded Successfully");
                },
                error => {
                    this.DataService.hideLoader();
                    this.DataService.warn("Failed to download report");
                }
            );
        } else {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            dialogConfig.width = "20%";
            dialogConfig.data = {
                site_name: this.siteDetails.site_name,
                graph_type: type
            };
            this.dialog.open(LoadGraphExcelExportComponent, dialogConfig);
        }
    }

    getSelectedGraphLabel(): string {
        const selected = this.graphTypes.find(g => g.value === this.selected_graph);
        return selected ? selected.viewValue : '';
    }

    getSiteCurrLoadInfoData() {
        let pf_visible = localStorage.getItem('pf_visible');
        let data = { 'site_id': this.siteId };
        this.dashData.getSiteCurrentLoadInfo(data).subscribe(
            response => {
                this.liveData.totalLoad = response.Total_Load;
                this.liveData.r_volt = response.R_Voltage;
                this.liveData.y_volt = response.Y_Voltage;
                this.liveData.b_volt = response.B_Voltage;
                this.liveData.r_current = response.R_Current;
                this.liveData.y_current = response.Y_Current;
                this.liveData.b_current = response.B_Current;
                this.liveData.r_pf = response.R_Power_Factor;
                this.liveData.y_pf = response.Y_Power_Factor;
                this.liveData.b_pf = response.B_Power_Factor;
                this.liveData.max_load = response.max_load;
                this.liveData.min_load = response.min_load;
                this.liveData.supply_source = response.Power_supply;

            },
            error => {

            }
        );
    }


    customerPage() {
        this.DataService.changeMessage("customer");
    }
    pf_details() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "70%";
        this.dialog.open(PfTableComponent, dialogConfig);

    }

    onClickChngpwd() {
        this.isShown = true;
    }

    onChangePwd() {

        this.chngpwd = { 'token': this.token, 'oldpassword': btoa(this.changePasswordModel.oldpassword), 'newpassword': btoa(this.changePasswordModel.newpassword) };
        this.UserService.changePassword(this.chngpwd).subscribe(
            data => {
                //console.log("server_Res: ", data);
            }
        );
    }

    home() {
        localStorage.removeItem('customer');
        location.reload();
    }

    sitePage() {
        localStorage.removeItem('wh_metering');
        localStorage.setItem('energy_saving', 'true');
        this.DataService.changeMessage("energy_saving");
        localStorage.setItem('siteId', this.siteId);
    }

    customRangePopup() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "20%";
        const dialogRef = this.dialog.open(CustomDateRangePickerComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if (result.length > 0 && result[0].from_date != '' && result[0].end_date != '') {
                result = result[0]
                let start_date = result.from_date;
                let end_date = result.end_date;
                let reqData = { "site_id": this.siteId, "from_date": start_date, "end_date": end_date }
                this.DataService.fetchDGFuelDataCustomeRange(reqData).subscribe(
                    res => {
                        this.ngZone.runOutsideAngular(() => {
                            this.dgFuelData = false;
                            this.dgFuelDataSelectionChange = true;
                            let dataSeries = res["data"]
                            let refuelSeries = res["refuel_alert"]
                            refuelSeries["dataLabels"] = { "enabled": true }
                            let theftSeries = res["theft_alert"]
                            theftSeries["dataLabels"] = { "enabled": true }
                            let dgFuelConsumed = res["dg_fuel_data"]
                            let dgUnitPerLtr = res["dg_unit_per_litre_data"]
                            let dgConsumptionDataSeries = res["dg_unit_data"]
                            dgConsumptionDataSeries["yAxis"] = 1
                            dgConsumptionDataSeries["dataLabels"] = { "enabled": true }

                            const options = {
                                colorCount: '5',
                                colors: ['#90ED7D', '#7cb5ec', '#ff0000', '#ff7a01', '#800080', '#00008B'],
                                chart: {
                                    type: "spline",
                                    backgroundColor: "#222222",
                                    scrollablePlotArea: { minWidth: 300, scrollPositionX: 1 },
                                    zoomType: "x",
                                    animation: false
                                },
                                navigator: { enabled: true },
                                scrollbar: { enabled: true },
                                legend: { itemStyle: { color: 'white' } },
                                xAxis: {
                                    type: 'datetime',
                                    dateTimeLabelFormats: { day: '%d %b %Y' },
                                    startOnTick: true,
                                    endOnTick: true,
                                    showLastLabel: true,
                                    labels: {
                                        style: { color: 'white' },
                                        rotation: -45,
                                        format: '{value:%Y-%m-%d %H:%M}',
                                    }
                                },
                                yAxis: [{
                                    labels: { style: { color: 'white' } },
                                    title: { text: 'Fuel Level (in Litres)', style: { color: 'white' } },
                                    opposite: false,
                                },
                                {
                                    gridLineWidth: 0,
                                    title: { text: 'Unit Consumed In KWH', style: { color: 'white' } },
                                    labels: { format: '{value} KWH', style: { color: 'white' } },
                                    opposite: true,
                                    min: 0,
                                    max: 600,
                                    tickInterval: 100,
                                }
                                ],
                                time: { useUTC: false },
                                title: { text: 'DG Fuel and Unit Trend', style: { color: 'white' } },
                                plotOptions: {
                                    series: {
                                        turboThreshold: 0,
                                        pointWidth: 15,
                                        animation: false
                                    },
                                    spline: {
                                        animation: false
                                    },
                                    areaspline: {
                                        animation: false
                                    }
                                },
                                series: [{
                                    type: "areaspline",
                                    name: 'Fuel Level',
                                    data: dataSeries,
                                    fillColor: (Highcharts as any).color('#808080').setOpacity(0.66).get(),
                                }, refuelSeries, theftSeries, dgConsumptionDataSeries, dgFuelConsumed, dgUnitPerLtr]
                            };

                            if (this.dgFuelChartInst) {
                                this.dgFuelChartInst.update(options as any, true, true, false);
                            } else {
                                this.dgFuelConsumptionSelectionOptions = options;
                            }
                            this.chartLoading = false;
                            this.cdr.detectChanges();
                        });
                    }
                )
            }

        });
    }

    dgFuelMonthlyTrend() {
        let data1 = { 'site_id': this.siteId, "user_type": this.user_type };

        this.DataService.dgFuelConsumptionMonthlyTrend(data1).subscribe(
            response => {
                this.ngZone.runOutsideAngular(() => {
                    const options = {
                        colorCount: '4',
                        colors: ['#90ED7D', '#ff7a01', '#7cb5ec', '#058DC7'],
                        chart: {
                            type: "column",
                            backgroundColor: "#222222",
                            overflow: 'scroll',
                            animation: false
                        },
                        title: {
                            style: { color: 'white' },
                            text: 'Monthly Trend Mains/DG-Units & DG-Fuel-Consumption'
                        },
                        credits: { enabled: false },
                        xAxis: {
                            labels: { style: { color: 'white' } },
                            categories: response['months']
                        },
                        yAxis: [{
                            labels: { style: { color: '#ff7a01' } },
                            title: { text: 'Units (KWH)', style: { color: '#ff7a01' } },
                            opposite: false
                        }, {
                            gridLineWidth: 0,
                            title: { text: 'DG Fuel Consumption', style: { color: '#7cb5ec' } },
                            labels: { style: { color: '#7cb5ec' } },
                            opposite: true
                        }],
                        plotOptions: {
                            column: {
                                stacking: 'normal' as any,
                                animation: false
                            },
                            series: {
                                animation: false
                            },
                            spline: {
                                animation: false
                            }
                        },
                        tooltip: {
                            formatter: function () {
                                return '<b>' + this.x + '</b><br/>' +
                                    this.series.name + ': ' + this.y + '<br/>'
                            }
                        },
                        legend: { itemStyle: { color: 'white' } },
                        series: [
                            {
                                name: 'Mains-Units',
                                data: response['mains_unit_consumption_monthly'],
                            },
                            {
                                name: 'DG-Units',
                                data: response["dg_unit_consumption_monthly"],
                            },
                            {
                                yAxis: 1,
                                name: 'DG-Fuel-Consumption',
                                data: response["dg_fuel_monthly"],
                                type: 'spline'
                            }
                        ]
                    };

                    if (this.trendChartInst) {
                        this.trendChartInst.update(options as any, true, true, false);
                    } else {
                        this.lineChartOption = options;
                    }
                    this.cdr.detectChanges();
                });
            });
    }
}



