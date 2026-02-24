import { from } from 'rxjs';
import { DataService } from './../services/data.service';
import { Album } from './../models/user';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material/slide-toggle';
import { MovieService } from '../services/movie.service';
import { chart } from 'highcharts';
import * as Highcharts from 'highcharts';
import * as solidGauge from 'highcharts/modules/solid-gauge.src';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  show: Boolean = false;
  dataSource: MatTableDataSource<any>;
  checked: Boolean
  userData: UntypedFormGroup;
  date = new UntypedFormControl(new Date());
  serializedDate = new UntypedFormControl((new Date()).toISOString().substring(0, 10));
  displayedColumns = ['id', 'userId', 'title']
  // displayedColumns = ["custId","custUserName","custEmail"]
  form: UntypedFormGroup;
  data: UntypedFormGroup;
  showModal: Boolean = false;
  lineChartOptions: any = {};
  gaugeOptions: any;
  Highcharts = Highcharts;
  chartConstructor = 'chart';
  chartCallback: any;
  oneToOneFlag = true;
  siteId;
  // SolidGaugeChart=SolidGaugeChart;
  constructor(private UserService: UserService, private dataService: DataService, private fb: UntypedFormBuilder, private album: MovieService) {
    this.userData = this.fb.group({
      countryName: ['', Validators.required],
      stateName: [(''), Validators.required],
      cityName: [(''), Validators.required]
    });

  }
  gaugeType = "full"
  gaugeValue = 39;
  gaugeLabel = "speed";
  gaugeAppendText = "km/h"
  gaugeThickness = 20;
  gaugeColor = "#ffff";
  gaugeThresholds = {
    '0': { color: 'green' },
    '40': { color: 'orange' },
    '75': { color: 'red' }
  };
  d = { "id": 1 }
  ngOnInit() {
    // this.getCustomers()
    this.form = this.fb.group({
      albums: this.fb.array([])
    });
    this.data = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ["", Validators.required],
      options: ['', Validators.required],
      subject: ["", Validators.required]
    });
    //movie service
    this.album.getAllAsFormArray(this.d).subscribe(albums => {
      this.form.setControl('albums', albums);
    });
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA)
  }
  // displayedColumns = ['custUserName','custEmail',];
  Country: any = ["india", "usa", "russia"];
  State: any = ["haryana", "punjab"]
  City: any = ["faridabad", "amritsar"]
  option = ["option1", "option2", "option3"]



  get albums(): UntypedFormArray {
    return this.form.get('albums') as UntypedFormArray;
  }
  submit() {
    let data = { "data": this.form.value }
    this.dataService.data(data).subscribe(
      response => {
        let result = response["result"]
        console.log("submit data result: ", result)
      }
    )
    console.log("data is:- ", this.form.value)
  }
  // On user change I clear the title of that album 
  onUserChange(event, album: UntypedFormGroup) {
    const title = album.get('title');

    title.setValue(null);
    title.markAsUntouched();
    // Notice the ngIf at the title cell definition. The user with id 3 can't set the title of the albums
  }
  onClick() {
    console.log("dataa :> ", this.data.value)
    this.data.reset()
  }


  onChange(ob: MatSlideToggleChange, id, date) {
    console.log("toggle changed")
    console.log(ob.checked);
    console.log(id)
    console.log(formatDate(date, 'yyyy/MM/dd', 'en'))
    // let matSlideToggle: MatSlideToggle = ob.source;	
    // console.log(matSlideToggle.color);
    // console.log(matSlideToggle.required);
  }

  edit(row) {
    console.log("edited data :- ", row)
    this.showModal = true;
  }
  hide() {
    this.showModal = false;
  }
  columnGraphFilterChanged() {

  }

  getCustomers() {
    this.UserService.getAllCustomers().subscribe(
      response => {
        console.log('response', response)
        let customer = [];
        for (let i = 0; i <= response['data'].length - 1; i++) {
          let data = response['data'][i];
          console.log("data", data)
          let customer_details = data['customer']
          let customer_id = customer_details['id'];
          let customer_username = customer_details['username'];
          let customer_email = customer_details['email'];
          let customer_contact = customer_details['Contact_number'];
          customer.push({
            'custId': customer_id,
            'custUserName': customer_username,
            'custEmail': customer_email,
            'custContact': customer_contact
          })
        }

        this.dataSource = new MatTableDataSource(customer);
        console.log(this.dataSource);
        console.log('This is site data source' + ": " + this.dataSource);


      }
    )
  }


  getAlarmGraph() {
    // if (this.user_type == "1"){
    //   this.data1 = {"id": JSON.parse(localStorage.getItem("id"))}
    // }else{
    // this.data1 = {"id": this.user_id}
    //}
    let data1 = { 'site_id': this.siteId };
    this.UserService.getCustAlarmGraphData(data1).subscribe(
      response => {
        // let seriesData = []; 
        //this.Highcharts = Highcharts;
        //let xyz = [response['Data'],{"leg":'baseline', 'type': "spline", 'data':[{"a":100,'b':90,'c':80,'d':86,'e':90,'f':100,'g':100,'h':100,'i':100,'j':100,'k':100,'l':100,'m':100,'n':100,'o':100,'p':100,'q':100,'r':100,'s':100,'t':100,'u':100,'v':100,'w':100,'x':100,'y':100,'z':100,'ca':100,'cb':100,'cc':100,'cd':100,}]}]


        // let internetGone:any;
        //      internetGone = {"name":"energyConsumed",'type':"spline",'y':response['energyConsumed']}
        // let light_damaged = {"name":"energySaved",'type':'spline','y':response['energySaved']}
        // let high_Consumtion = {"name": "percentageSaved",'type':'spline','y':response['percentageSaved']}


        // let data2 = [{"data":[internetGone, light_damaged, high_Consumtion]}]
        // // seriesData.push(consumption);
        // // seriesData1.push(dataSaving);
        // seriesData.push(data2);


        // highcharts = Highcharts;
        // this.lineChartOptions = {
        //   colorCount:'4',
        //   colors: ['#90ED7D','#ff7a01', '#7cb5ec', '#058DC7'],
        //   chart: {
        //     type: "spline",
        //     backgroundColor: "#222222",

        //     overflow:'scroll'
        //   },
        // // title: {
        // //             style : {
        // //               color: 'white',
        // //             },
        // //             // text: 'Snapshot Monthly Trend'
        // //           },
        //   credits: {
        //     enabled: false
        //   },
        //   xAxis: {
        //     labels: {
        //       style: {
        //         color: 'white',
        //       },
        //     },
        //     // categories: response['alarm_name_list']
        //   },
        //   yAxis: {
        //     title: {
        //       style: {color:'white',},
        //       text: "Value"
        //     },
        //     labels : {
        //       style: {
        //         color:'white'
        //       }
        //     }
        //   },



        //   tooltip: {
        //     valueSuffix: ""
        //   },
        //   legend :{
        //     itemStyle : {color:'white',},
        //   },
        //   series: response["Data"]

        //     // {
        //     //   name: 'Energy Consumed',
        //     //   data: response['energyConsumed']
        //     // },
        //     // {
        //     //   name: 'Energy Saved',
        //     //   data: response["energySaved"]
        //     // },
        //     // {
        //     //   name: 'Percentage Saved',
        //     //   data: response["percentageSaved"]
        //     // }

        // }  
        // console.log("graph data", this.lineChartOptions)


        // this.gaugeOptions = {
        //   chart: {
        //       type: 'solidgauge'
        //   },

        //   title: null,

        //   pane: {
        //       center: ['50%', '85%'],
        //       size: '140%',
        //       startAngle: -90,
        //       endAngle: 90,
        //       background: {
        //           backgroundColor:
        //               Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
        //           innerRadius: '60%',
        //           outerRadius: '100%',
        //           shape: 'arc'
        //       }
        //   },

        //   exporting: {
        //       enabled: false
        //   },

        //   tooltip: {
        //       enabled: false
        //   },

        //   // the value axis
        //   yAxis: {
        //       stops: [
        //           [0.1, '#55BF3B'], // green
        //           [0.5, '#DDDF0D'], // yellow
        //           [0.9, '#DF5353'] // red
        //       ],
        //       lineWidth: 0,
        //       tickWidth: 0,
        //       minorTickInterval: null,
        //       tickAmount: 2,
        //       title: {
        //           y: -70
        //       },
        //       labels: {
        //           y: 16
        //       }
        //   },

        //   plotOptions: {
        //       solidgauge: {
        //           dataLabels: {
        //               y: 5,
        //               borderWidth: 0,
        //               useHTML: true
        //           }
        //       }
        //   }
        // };


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
          series:

          {
            name: 'Energy Consumed',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
          },
          // {
          //   name: 'Energy Saved',
          //   data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
          // },
          // {
          //   name: 'Percentage Saved',
          //   data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
          // }

        }


      });

  }





}

export interface PeriodicElement {
  id: Number;
  userId: string;
  title: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    id: 1,
    userId: 'Hydrogen',
    title: ''
  },
  {
    id: 2,
    userId: 'helium',
    title: ''
  }

];







