import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import { UserService } from './../services/user.service';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');


Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-output-graph',
  templateUrl: './output-graph.component.html',
  styleUrls: ['./output-graph.component.css']
})
export class OutputGraphComponent implements OnInit {
  lineChartOptions: any = {};
  siteId = 90;
  Highcharts = Highcharts;
  chartConstructor = 'chart';
  chartCallback: any;
  oneToOneFlag = true;
  @ViewChild('alarmdata') alarmdata: ElementRef;


  loadData(data) {
    this.alarmdata.nativeElement.innerHTML = data;
  }

  constructor(private UserService: UserService,) { }

  ngOnInit() {
    Highcharts.chart('alarmdata', this.lineChartOptions);
    this.getMonthlyTrend();
  }

  getMonthlyTrend() {

    let data1 = { 'site_id': this.siteId };
    this.UserService.energySavingMonthlyTrend(data1).subscribe(
      response => {
        let seriesData = [];
        //this.Highcharts = Highcharts;
        //let xyz = [response['Data'],{"leg":'baseline', 'type': "spline", 'data':[{"a":100,'b':90,'c':80,'d':86,'e':90,'f':100,'g':100,'h':100,'i':100,'j':100,'k':100,'l':100,'m':100,'n':100,'o':100,'p':100,'q':100,'r':100,'s':100,'t':100,'u':100,'v':100,'w':100,'x':100,'y':100,'z':100,'ca':100,'cb':100,'cc':100,'cd':100,}]}]
        for (let k = 0; k < response['Data'].length; k++) {

          let energyConsumed: any;
          energyConsumed = { "name": "energyConsumed", 'y': response['Data'][k]['energy_consumed'] }
          let enegySaved = { "name": "energySaved", 'y': response['Data'][k]['energy_saved'] }
          let percentageSaved = { "name": "percentageSaved", 'type': 'spline', 'y': response['Data'][k]['percentage_saved'] }


          let data2 = [{ "data": [energyConsumed, enegySaved, percentageSaved] }]
          // seriesData.push(consumption);
          // seriesData1.push(dataSaving);
          seriesData.push(data2);
        }

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
          yAxis: {
            title: {
              style: { color: 'white', },
              text: "Value"
            },
            labels: {
              style: {
                color: 'white'
              }
            }
          },



          tooltip: {
            valueSuffix: ""
          },
          legend: {
            itemStyle: { color: 'white', },
          },
          series: seriesData

          // {
          //   name: 'Energy Consumed',
          //   data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
          // },
          // {
          //   name: 'Energy Saved',
          //   data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
          // },
          // {
          //   name: 'Percentage Saved',
          //   data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
          // }

        }
        console.log("graph data", this.lineChartOptions)
      });

  }
}
