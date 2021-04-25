import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DashboardService } from '../../dashboard.service';
import { multi } from '../../dummy';
import {  LineModel, PointModel } from '../../models/line-chart';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit{
  hospitalDailyDoses: LineModel[] = [];
  dailyDoses: LineModel[] = [];
  hospitalRemainingDoses: PointModel[] = [];
  distributedDoses: PointModel[] = [];
  manufacturerData: PointModel[] = [];

  cardColor: string = '#ffffff';
  constructor(private dashboardService: DashboardService,
    private ngxLoader: NgxUiLoaderService) {
  }
  ngOnInit(): void {
    this.getData();
  }
  
  getDailyAdministeredHospitalDoses(){
    this.dashboardService.getHospitalDailyAdministrations().subscribe(result=>{
      this.hospitalDailyDoses=result;
      this.ngxLoader.stop();
    });
  }

  getDailyAdministeredDoses(){
    this.dashboardService.getDailyAdministrations().subscribe(result=>{
      this.ngxLoader.stop();
      this.dailyDoses=result;
    });
  }

  getRemainingHospitalDoses(){
    this.dashboardService.getHospitalRemainingVials().subscribe((result : any[])=>{
      this.hospitalRemainingDoses=result.map(e=> new PointModel(e.name,e.remainingDoses));
      this.ngxLoader.stop();
    });
  }


  getRemainingDosesDistribution(){
    this.dashboardService.getRemainingVialsDistribution().subscribe(res=>{
      this.distributedDoses=res;
      this.ngxLoader.stop();
    });
  }

  getManufacturerDosesData(){
    this.dashboardService.getManufacturerDosesData().subscribe(res=>{
      
      this.ngxLoader.stop();
      if(res.Manufacturer){
        this.manufacturerData=[ 
        new PointModel("Total Ordered",res.Manufacturer.ordered),
        new PointModel("Total Administered",res.Manufacturer.administered),
        new PointModel("Doses Left",res.Manufacturer.remainingInCountry)
      ];
      }
    });
  }

  getData(){
    this.getDailyAdministeredHospitalDoses();
    this.getRemainingHospitalDoses();
    this.getManufacturerDosesData();
    this.getRemainingDosesDistribution();
    this.getDailyAdministeredDoses();
  }
}
