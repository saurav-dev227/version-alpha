import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-over',
  templateUrl: './dialog-over.component.html',
  styleUrls: ['./dialog-over.component.css']
})
export class DialogOverComponent implements OnInit {
  loginerror:string;
  
  constructor(public dialogRef: MatDialogRef<DialogOverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.loginerror = data;
    }

  ngOnInit() {
  }

}
