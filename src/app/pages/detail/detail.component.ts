import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import {LineChartData, LineChartSerieData } from 'src/app/core/models/LineChartData';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  olympics$: Observable<Olympic[]> = of([]);

  countryName: string = '';
  entryCount: number = 0;
  medalCount: number = 0;
  athleteCount: number = 0;

  // Chart parameters:
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  yAxisLabel: string = 'Medal count';
  xAxisTicks: string[] = [];
  lineChartDataList: LineChartData[] = [];

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const olympicId: string = this.route.snapshot.params['id'];
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((olympics) => {
      this.onOlympicsChanged(olympics, olympicId);
    });
  }

  onOlympicsChanged(olympics: Olympic[], olympicId: string): void {
    if (olympics.length == 0) {
      return;
    }

    let olympic: Olympic | undefined = olympics.find(
      (olympic) => olympic.id == olympicId,
    );

    if (olympic === undefined) {
      this.router.navigateByUrl('**');
      return;
    }

    this.countryName = olympic.country;
    this.entryCount = olympic.participations.length;
    this.medalCount = this.getMedalCount(olympic);
    this.athleteCount = this.getAthleteCount(olympic);

    this.fillChart(olympic);
  }

  fillChart(olympic: Olympic): void {
    let series: LineChartSerieData[] = [];

    this.xAxisTicks = [];
    this.lineChartDataList = [];

    olympic.participations.forEach((participation) => {
      series.push(
        new LineChartSerieData(participation.medalsCount, participation.year),
      );
      this.xAxisTicks.push(participation.year);
    });

    this.lineChartDataList.push(new LineChartData(olympic.country, series));
  }

  getMedalCount(olympic: Olympic): number {
    return olympic.participations.reduce((medalCount, participation) => {
      return medalCount + participation.medalsCount;
    }, 0);
  }

  getAthleteCount(olympic: Olympic): number {
    return olympic.participations.reduce((athleteCount, participation) => {
      return athleteCount + participation.athleteCount;
    }, 0);
  }

  xAxisTickFormatting(value: string) {
    return value;
  }
}
