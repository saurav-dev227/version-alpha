import { Component, OnInit } from '@angular/core';
import {MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Inject} from '@angular/core';
import { DataService } from '../services/data.service';
export interface DialogData {

  from_date: string;
  till_date: string;
 
}
@Component({
  selector: 'app-custom-date-range-picker',
  templateUrl: './custom-date-range-picker.component.html',
  styleUrls: ['./custom-date-range-picker.component.css']
})
export class CustomDateRangePickerComponent implements OnInit {

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<CustomDateRangePickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private dataService:DataService,) { }


    date = new UntypedFormControl(new Date());
    serializedDate = new UntypedFormControl((new Date()).toISOString().substring(0,10));
    siteId= localStorage.getItem('siteId');
    customDateRange = new UntypedFormGroup({
      startDate: new UntypedFormControl(''),
      endDate: new UntypedFormControl(''),
    });
  ngOnInit() {
  }

  onSubmit(){

    let reqData = [{"from_date":this.customDateRange.value.startDate,"end_date":this.customDateRange.value.endDate}]
    this.dialogRef.close(reqData)
  }
  onNoClick(){
    this.dialogRef.close([])
  }
}
