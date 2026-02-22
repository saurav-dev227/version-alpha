import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';

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
