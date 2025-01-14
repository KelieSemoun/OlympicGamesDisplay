import { Component, OnInit, ViewChild } from '@angular/core';
import { find, map, Observable, tap } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";
import { ActivatedRoute } from '@angular/router';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit{
  @ViewChild("lineChart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  public olympics$!: Observable<Olympic[]>;
  private currentOlympic!: Olympic;

  constructor(private olympicService: OlympicService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.pipe(
        map((olympics : Olympic[]) => olympics.find(olympic => olympic.id === Number(this.route.snapshot.params['id'])))
    ).subscribe(res => {
      this.currentOlympic = res!;
      this.initializeChartOptions();
    });

  }


  private initializeChartOptions() {
    this.chartOptions = {
      series: [
        {
          name: "medals",
          data: this.getMedalsData()
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: this.currentOlympic.country,
        align: "center"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: this.getXAxisCategories()
      },
      yaxis: {
        min: 0,
        max: 150,
        tickAmount: 10
      }
    };
  }

  private getMedalsData() : number[] {
    let res: number[] = [];
    for(let i=0 ; i<this.currentOlympic.participations.length; i++){
      res.push(this.currentOlympic.participations[i].medalsCount)
    }
    return res
  }

  private getXAxisCategories() : string[] {
    let res: string[] = [];
    for(let i=0 ; i<this.currentOlympic.participations.length; i++){
      res.push(String(this.currentOlympic.participations[i].year))
    }
    return res
  }
}
