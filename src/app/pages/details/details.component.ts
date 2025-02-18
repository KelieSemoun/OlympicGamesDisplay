import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map, Observable, Subscription, tap } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
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
};

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy{
  @ViewChild("lineChart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  public olympics$!: Observable<Olympic[]>;
  public currentOlympic!: Olympic;
  public medalsCount!: number;
  public athletesCount!: number;
  private subscription!: Subscription;

  constructor(private olympicService: OlympicService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {    
    this.olympics$ = this.olympicService.getOlympics();
    //Transformation of the initial Data array into a single Olympic object that has the id and its id route snapshot corresponding
    this.subscription = this.olympics$.pipe(
        map((olympics : Olympic[]) => olympics.find(olympic => olympic.id === Number(this.route.snapshot.params['id'])))
    ).subscribe(res => {
      this.currentOlympic = res!;
      this.initializeChartOptions();
      this.medalsCount = this.currentOlympic.participations.reduce((acc, participation) => acc +  Number(participation.medalsCount), 0)
      this.athletesCount = this.currentOlympic.participations.reduce((acc, participation) => acc +  Number(participation.athleteCount), 0)
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
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
