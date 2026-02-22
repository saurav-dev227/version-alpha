import { Component, OnInit } from '@angular/core';
import { Inject} from '@angular/core';
import {MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';
import { DataService } from '../services/data.service';
export interface DialogData {
  animal: string;
  name: string;
}



@Component({
  selector: 'app-fems-dialog',
  templateUrl: './fems-dialog.component.html',
  styleUrls: ['./fems-dialog.component.css']
})
export class FemsDialogComponent implements OnInit {
  // animal: string;
  // name: string;
 

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<FemsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private DataService:DataService) {
      
     }

  

  ngOnInit() {
  }

  deleteRecord(){
    console.log("##################", this.data)
      this.DataService.deleteInventoryData(this.data).subscribe(
    response =>{
      console.log("response : ", response);
      this.dialogRef.close();
    }
  )
    

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  

}

