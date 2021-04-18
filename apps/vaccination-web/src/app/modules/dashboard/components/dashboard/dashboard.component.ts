import { Component, OnInit } from '@angular/core';
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
  constructor(private dashboardService: DashboardService) {
  }
  ngOnInit(): void {
    this.getData();
  }
  
  getDailyAdministeredHospitalDoses(){
    this.dashboardService.getHospitalDailyAdministrations().subscribe(result=>{
      this.hospitalDailyDoses=result;
    });
  }

  getDailyAdministeredDoses(){
    this.dashboardService.getDailyAdministrations().subscribe(result=>{
      this.dailyDoses=result;
    });
  }

  getRemainingHospitalDoses(){
    this.dashboardService.getHospitalRemainingVials().subscribe((result : any[])=>{
      this.hospitalRemainingDoses=result.map(e=> new PointModel(e.name,e.remainingDoses));
    });
  }


  getRemainingDosesDistribution(){
    this.dashboardService.getRemainingVialsDistribution().subscribe(res=>{
      this.distributedDoses=res;
    });
  }

  getManufacturerDosesData(){
    this.dashboardService.getManufacturerDosesData().subscribe(res=>{
      this.manufacturerData=[ 
        new PointModel("Total Ordered",res.Manufacturer.ordered),
      new PointModel("Total Administered",res.Manufacturer.administered),
      new PointModel("Doses Left",res.Manufacturer.remainingInCountry)
    ];
      console.log(this.manufacturerData,res)
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
