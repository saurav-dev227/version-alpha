import { Component, OnInit } from '@angular/core';
import { Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { DataService } from '../services/data.service';
import { NgModule } from '@angular/core';
export interface DialogData {

     from_date: string;
     till_date: string;
     avgValue:string;
     energyConsumed:string;
  // next_service: string;
  // updatedBy: string;
}
@Component({
    selector: 'app-avg-data',
    templateUrl: './avg-data.component.html',
    styleUrls: ['./avg-data.component.css'],
    standalone: false
})


export class AvgDataComponent implements OnInit {
  avgDatavalue: any;
  totalDatavalue: any;
  noofDays: any;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AvgDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private dataService:DataService) { }

    siteId= localStorage.getItem('siteId');
    date = new UntypedFormControl(new Date());
    serializedDate = new UntypedFormControl((new Date()).toISOString().substring(0,10));

  
    avgDataForm = new UntypedFormGroup({
      startDate: new UntypedFormControl(''),
      endDate: new UntypedFormControl(''),
      avgvalue: new UntypedFormControl(''),
      totalvalue: new UntypedFormControl(''),
      noOfDays: new UntypedFormControl('')

    });
  ngOnInit() {
    console.log("#################### I am in ngOnInit fuction: ", this.data);
    // this.getDeviceName();
    if (this.data !== null){
      this.avgDataForm.setValue({
        startDate: this.data.from_date ? this.data.from_date:"",
        endDate: this.data.till_date?this.data.till_date:"", 
        avgvalue: this.data.avgValue?this.data.avgValue:"",
        energyConsumed:this.data.energyConsumed?this.data.energyConsumed:""
      });
    }
    
  }
 
  
  onSubmit(){
    let data = {"siteId":this.siteId,"from_date":this.avgDataForm.value.startDate,"till_date":this.avgDataForm.value.endDate,}
     console.log("function called", this.avgDataForm.value);
    this.dataService.avgDataValue(data).subscribe(
      response =>{
        console.log("response : ", response)
        this.avgDatavalue = response['value'];
        this.totalDatavalue = response['energyConsumed'];
        this.noofDays = response['totalDays']
      }
    )
    
    // this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
