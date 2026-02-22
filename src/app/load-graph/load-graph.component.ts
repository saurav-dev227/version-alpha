import { Component, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { data } from 'jquery';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-load-graph',
  templateUrl: './load-graph.component.html',
  styleUrls: ['./load-graph.component.css']
})
export class LoadGraphComponent implements OnInit {
  lineChartOptions: any = {};
  Highcharts = Highcharts;
  chartConstructor = 'chart';
  chartCallback: any;
  oneToOneFlag = true;
  chartLoading: Boolean = false;
  @ViewChild('chart') chart;



  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.load_graph();
    console.log("############################");
    // setTimeout(this.load_data_every_second(),1000)

    // }, 1000)
  }
  //   ngAfterViewInit() {
  //     Observable.interval(5000).subscribe(
  //         response => {
  //           if(this.chartLoading){
  //             this.load_data_every_second();
  //           }

  //           }
  //     );
  // }

  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  load_data_every_second() {
    console.log("load function called")
    this.dataService.load_graph_every_sec({}).subscribe(
      res => {
        // response = res["data"]
        for (let i = 0; i <= res['data'].length - 1; i++) {
          this.chart.chart.series[0].addPoint(res['data'][i], true, false)

        }

      }
    )
    // return response
  }

  load_graph() {
    let reqData = { "site_id": 35, "date": "2023/04/26" }
    this.dataService.dgFuelConsumptionData(reqData).subscribe(
      res => {
        let dataSeries = res["data"]
        console.log("api data: ", dataSeries)
        this.chartLoading = true;
        this.lineChartOptions = {

          chart: {
            type: "spline",
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

          xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
              day: '%d %b %Y'    //ex- 01 Jan 2016
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true,
            labels: {
              rotation: -45,
              //Specify the formatting of xAxis labels:
              format: '{value:%Y-%m-%d %H:%M}',

            }
          },


          time: {
            useUTC: false
          },



          title: {
            text: 'Fuel Level Trend'
          },

          // exporting: {
          //     enabled: false
          // },
          plotOptions: {
            series: {
              turboThreshold: 0,
              // color: 'purple'
            }
          },

          series: [{
            name: 'Fuel Consumption',
            data: dataSeries,
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

          },
            //   {name: 'DG',
            //   data: (function () {
            //       // generate an array of random data
            //       var data = [],
            //           time = (new Date()).getTime(),
            //           i;
            //       console.log("time:", time)
            //       for (i = -100; i <= 0; i += 1) {
            //           data.push([
            //               time + i * 1000,
            //               Math.round(Math.random() * 100)
            //           ]);
            //       }
            //       return data;
            //   }()),
            //   color:'orange'
            // }
          ]
        }
      }
    )
  }
}


