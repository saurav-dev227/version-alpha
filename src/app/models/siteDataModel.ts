import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

export class SiteDetailsModel {
    site_id: number;
    site_name : string;
    site_addr: string;
    site_type : string;
    site_mgr_name: string;
    site_mgr_mob : string;
    site_mgr_email: string;
    total_blocks: number;
    total_aisles : number;
    total_single_src_meters : number;
    total_dual_src_meters: number;
}

export class LiveMeteringDataModel {
    totalLoad : any;
    r_volt: any;
    y_volt : any;
    b_volt : any;
    r_current: any;
    y_current: any;
    b_current: any;
    r_pf: any;
    y_pf: any;
    b_pf:any;
    max_load:any;
    min_load:any;
    supply_source: any;
}

export class BaselineData{
    serialNo: string;
    AisleGroup: string;
    TotalLights: string;
    wattage1Light: string;
    ExpectedConsump: string;
    CurrentConsump: string;
   
    static asFormGroup(baselineData: BaselineData):UntypedFormGroup{
      const fg = new UntypedFormGroup({
        serialNo: new UntypedFormControl(baselineData.serialNo,Validators.required),
        AisleGroup: new UntypedFormControl(baselineData.AisleGroup,Validators.required), 
        TotalLights: new UntypedFormControl(baselineData.TotalLights,Validators.required), 
        wattage1Light: new UntypedFormControl(baselineData.wattage1Light,Validators.required), 
        ExpectedConsump: new UntypedFormControl(baselineData.ExpectedConsump,Validators.required), 
        CurrentConsump: new UntypedFormControl(baselineData.CurrentConsump,Validators.required) 
      });
      return fg;
    }
  }