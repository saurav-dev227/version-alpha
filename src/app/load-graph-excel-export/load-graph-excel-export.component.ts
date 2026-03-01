import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Inject } from '@angular/core';
import { DataService } from '../services/data.service';
import { formatDate } from '@angular/common';

export interface DialogData {
    site_name: string;
    graph_type: string;
}

@Component({
    selector: 'app-load-graph-excel-export',
    templateUrl: './load-graph-excel-export.component.html',
    styleUrls: ['./load-graph-excel-export.component.css'],
    standalone: false
})
export class LoadGraphExcelExportComponent implements OnInit {
    myObj = JSON.parse(localStorage.getItem("account"));
    user_id = this.myObj["id"];
    user_type = this.myObj["UserType"];
    siteId = localStorage.getItem('siteId');
    siteName = '';
    exportLoading = false;

    excelDataForm = new UntypedFormGroup({
        startDate: new UntypedFormControl(new Date(), [Validators.required]),
        endDate: new UntypedFormControl(new Date(), [Validators.required]),
    });

    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<LoadGraphExcelExportComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
    ) { }

    ngOnInit() {
        // Fetch site name from passed data
        this.siteName = this.data.site_name || localStorage.getItem('siteName') || 'Current Site';

        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        this.excelDataForm.patchValue({
            startDate: thirtyDaysAgo,
            endDate: today
        });
    }

    onSubmit() {
        if (this.excelDataForm.invalid) return;

        this.exportLoading = true;
        const start = formatDate(this.excelDataForm.value.startDate, 'yyyy/MM/dd', 'en');
        const end = formatDate(this.excelDataForm.value.endDate, 'yyyy/MM/dd', 'en');

        let data = {
            "site_id": this.siteId,
            "from_date": start,
            "end_date": end,
            "graph_type": this.data.graph_type || "2"
        }

        this.dataService.download_load_data_excel_test(data).subscribe(
            (response: any) => {
                let blob: Blob = response.body as Blob;
                var downloadURL = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = ("load_data_" + start.replace(/\//g, '-') + "_to_" + end.replace(/\//g, '-') + ".csv");
                link.click();

                this.exportLoading = false;
                this.dataService.success("Report Downloaded Successfully");
                this.dialogRef.close();
            },
            error => {
                this.exportLoading = false;
                this.dataService.warn("Failed to download report");
            }
        )
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
