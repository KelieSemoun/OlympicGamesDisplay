import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { Olympic } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
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
  private customOlympics: {id: number, country: string, medalsCount: number}[] = []; // Expected outcome of data transformation for this class

  constructor(private olympicService: OlympicService, private router: Router) {}
  
  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    // Transformation of the initial data array and pushes each transformed component into customOlympics
    this.olympics$.subscribe(
      (values: Olympic[]) => {
        values.map((val) => ({
          id: val.id,
          country: val.country,
          medalsCount: val.participations.reduce((acc, participation) => acc +  Number(participation.medalsCount), 0)
        })).flatMap((data) => this.customOlympics.push(data));
        this.initializeChartOptions();
      }
    )    
  }

  private initializeChartOptions() : void{
    this.chartOptions = {
      series: this.getMedalsCount(),
      chart: {
        width: 700,
        type: "pie",
        events: {
          click: (e, ctx, opts) => {
            this.router.navigateByUrl(`countries/${this.customOlympics[opts.dataPointIndex].id}`);
          }
        }
      },
      labels: this.getCountryLabels(),
      legend: {
        position:'right',
        offsetY: 75
      },
      dataLabels: {
        enabled: true
      },
      responsive: [
        {
          breakpoint: 650,
          options: {
            chart: {
              width: 400
            }
          }
        }
      ],
      title: {
        text: "Distribution of Olympic Medals earned by country",
        align: "center",
      }
    };
  }

  private getCountryLabels(): string[]{
    let res: string[] = [];
    for(let i=0 ; i<this.customOlympics.length ; i++){
      res.push(this.customOlympics[i].country);
    }
    return res;
  }

  private getMedalsCount(): ApexNonAxisChartSeries{
    let res: ApexNonAxisChartSeries = [];
    for(let i=0 ; i<this.customOlympics.length ; i++){
      res.push(this.customOlympics[i].medalsCount);
    }
    return res;
  }
}
