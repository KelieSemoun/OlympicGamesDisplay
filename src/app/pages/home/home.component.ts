import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { Participation } from 'src/app/core/models/Participation';
import { Olympic } from 'src/app/core/models/Olympic';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild("chart", {static: false}) chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  public olympics$!: Observable<Olympic[]>;
  public customOlympics: {id: string, country: string, medalsCount: number}[] = [];

  constructor(private olympicService: OlympicService) {}
  
  ngOnInit(): void {
    console.log('Olypics = ', this.olympicService.getOlympics())
    this.olympics$ = this.olympicService.getOlympics()/*.pipe(
      map((result): {id: string, country: string, medalsCount: number}[]=>{
        if(result !== null){
          return result!.map((obj: Olympic) =>{
            return{
              id: obj.id,
              country: obj.country,
              medalsCount: obj.participations.reduce((acc, participation) => acc +  Number(participation.medalsCount), 0)
            }
          })
        }       
      })
    );*/
    this.olympics$.subscribe(
      (values: Olympic[]) => {
        values.map((val) => ({
          id: val.id,
          country: val.country,
          medalsCount: val.participations.reduce((acc, participation) => acc +  Number(participation.medalsCount), 0)
        })).flatMap((data) => this.customOlympics.push(data));
      }
    )
    console.log(this.customOlympics);
    this.initializeChartOptions();
    /*this.olympicService.getOlympics().subscribe(data => {
      if(data !== null){
        for(let i=0 ; i<data.length ; i++){
          this.olympics.push(new Olympic(data[i].country, ));
        }
        this.initializeChartOptions();
      }
    });*/ 
  }

  private initializeChartOptions() : void{
    this.chartOptions = {
      series: [96, 54, 345, 125, 113],
      chart: {
        width: 700,
        type: "pie"
      },
      labels: ["Italy", "Spain", "United States", "Germany", "France"],//this.getCountryLabels(),
      dataLabels: {
        enabled: false
      },
      responsive: [
        {
          breakpoint: 650,
          options: {
            chart: {
              width: 400
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

 /* private getCountryLabels(): string[]{
    let res: string[] = [];
    for(let i=0 ; i<this.olympics.length ; i++){
      res.push(this.olympics[i].country);
    }
    return res;
  }*/
}
