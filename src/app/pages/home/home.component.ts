import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
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
  public olympics: Olympic[] = [];
  public chartOptions!: Partial<ChartOptions>;
  public olympics$: Observable<{id: string, country: string, participations: Participation[]}[] | null> = of(null);

  constructor(private olympicService: OlympicService) {}
  
  ngOnInit(): void {
    this.olympicService.getOlympics().pipe().subscribe(data => {
      if(data !== null){
        for(let i=0 ; i<data.length ; i++){
          this.olympics.push(new Olympic(data[i].country));
        }
        this.initializeChartOptions();
      }
    }); 
  }

  private initializeChartOptions() : void{
    this.chartOptions = {
      series: [96, 54, 345, 125, 113],
      chart: {
        width: 700,
        type: "pie"
      },
      labels: this.getCountryLabels(),
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

  private getCountryLabels(): string[]{
    let res: string[] = [];
    for(let i=0 ; i<this.olympics.length ; i++){
      res.push(this.olympics[i].country);
    }
    return res;
  }
}
