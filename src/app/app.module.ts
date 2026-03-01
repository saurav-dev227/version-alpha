import { ModalService } from './services/modalService';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { GlobalService } from './services/global.service';
import { MatDialogModule } from '@angular/material/dialog';

import { DialogOverComponent } from './dialog-over/dialog-over.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { NgxGaugeModule, } from 'ngx-gauge';

import { HighchartsChartModule } from 'highcharts-angular';

import { ComingDashComponent } from './coming-dash/coming-dash.component';
import { OutputGraphComponent } from './output-graph/output-graph.component';
// import { PieGraphComponent } from './pie-graph/pie-graph.component';
// import { BarchartComponent } from './barchart/barchart.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
// import { TestComponent } from './test/test.component';
import { WhMeteringComponent } from './wh-metering/wh-metering.component';
import { BaselineComponent } from './baseline/baseline.component';
import { DialogSwitchdashComponent } from './dialog-switchdash/dialog-switchdash.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminComponent } from './admin/admin.component';
import { AlarmComponent } from './alarm/alarm.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FirePumpAlarmComponent } from './fire-pump-alarm/fire-pump-alarm.component';
import { FemsComponent } from './fems/fems.component';
import { AddDeviceDialogComponent } from './add-device-dialog/add-device-dialog.component';
import { FemsDialogComponent } from './fems-dialog/fems-dialog.component';
import { AddDevtypeDialogComponent } from './add-devtype-dialog/add-devtype-dialog.component';
import { LightsWattDataComponent } from './lights-watt-data/lights-watt-data.component';
import { FanswattdataComponent } from './fanswattdata/fanswattdata.component';
import { DeviceDetailsFemsComponent } from './device-details-fems/device-details-fems.component';
import { ExpiredDeviceDetailsFemsComponent } from './expired-device-details-fems/expired-device-details-fems.component';
import { AvgDataComponent } from './avg-data/avg-data.component';
import { ExcelsheetComponent } from './excelsheet/excelsheet.component';
import { LoadGraphComponent } from './load-graph/load-graph.component';
import { PfTableComponent } from './pf-table/pf-table.component';
import { LoadDataTableComponent } from './load-data-table/load-data-table.component';
import { CustomDateRangePickerComponent } from './custom-date-range-picker/custom-date-range-picker.component';
import { DgFuelExcelExportComponent } from './dg-fuel-excel-export/dg-fuel-excel-export.component';
import { SubmeteringComponent } from './submetering/submetering.component';
import { LoadGraphExcelExportComponent } from './load-graph-excel-export/load-graph-excel-export.component';



//pass the fusioncharts library and chart modules
// FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DialogOverComponent,
        DashboardComponent,
        SuperAdminComponent,
        ComingDashComponent,
        OutputGraphComponent,
        //PieGraphComponent,
        //BarchartComponent,
        CustomerDashboardComponent,
        WarehouseComponent,
        //TestComponent,
        WhMeteringComponent,
        BaselineComponent,
        DialogSwitchdashComponent,
        AdminComponent,
        AlarmComponent,
        FirePumpAlarmComponent,
        FemsComponent,
        AddDeviceDialogComponent,
        FemsDialogComponent,
        AddDevtypeDialogComponent,
        LightsWattDataComponent,
        FanswattdataComponent,
        DeviceDetailsFemsComponent,
        ExpiredDeviceDetailsFemsComponent,
        AvgDataComponent,
        ExcelsheetComponent,
        LoadGraphComponent,
        PfTableComponent,
        LoadDataTableComponent,
        CustomDateRangePickerComponent,
        DgFuelExcelExportComponent,
        SubmeteringComponent,
        LoadGraphExcelExportComponent,
    ],
    exports: [MatDialogModule
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        AppRoutingModule,
        NgxGaugeModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatGridListModule,
        LayoutModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatDialogModule,
        // FusionChartsModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
        MatMenuModule,
        HighchartsChartModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatSnackBarModule,
        MatRadioModule,
        MatCardModule,
        MatSlideToggleModule], providers: [
            GlobalService,
            ModalService,
            provideHttpClient(withInterceptorsFromDi()),
        ]
})

export class AppModule { }
