import { Component, OnInit } from '@angular/core';
import { Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormControl,Validators } from '@angular/forms';
import { DataService } from '../services/data.service';

export interface DialogData {
  serialNo: string;
  deviceName: string;
  category: string;

}



@Component({
    selector: 'app-add-devtype-dialog',
    templateUrl: './add-devtype-dialog.component.html',
    styleUrls: ['./add-devtype-dialog.component.css'],
    standalone: false
})

export class AddDevtypeDialogComponent implements OnInit {

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddDevtypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private dataService:DataService) { }
     
      siteId= localStorage.getItem('siteId');
     
      devTypeDataForm = new UntypedFormGroup({
      deviceName: new UntypedFormControl(''),
      category: new UntypedFormControl(''),

    });

  
  ngOnInit() {
    if (this.data !== null){
      this.devTypeDataForm.setValue({ 
        deviceName: this.data.deviceName, 
        category: this.data.category,
       
       
      });
    }

  }
  
  onSubmitDevType(){
    // let data = {"siteId":this.siteId,"deviceName":['deviceName'],"modelNo":['deviceModelNo'],"location":['location'],"warrenty":['warrantyTillDate'],"nextServiceDate":['next_service'],"lastServiceDate":['last_service']}
   let data = {"siteId":this.siteId,"deviceName":['deviceName'],"category":['category'],}
    console.log("This is a site id:",data);
    // this.dialogRef.close();
    //  console.log("function called", this.devTypeDataForm.value);
    this.dataService.fireDeviceTypeAdd(this.devTypeDataForm.value).subscribe(
      response =>{
        console.log("response : ", response)
      }
    )
    this.dataService.success('Device type saved successfully !');
    this.dialogRef.close();
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
