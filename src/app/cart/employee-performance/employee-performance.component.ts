import * as moment from 'moment';
import '../../../../node_modules/chart.js/dist/Chart';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '../../core/translate/translate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../shared/local-storage.service';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { PageLoaderService } from '../../shared/page-loader-service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PerformanceService } from '../service/performance.service';
import { CartService } from '../service/cart.service';
import { CartStateModel } from '../model/cart-state.model';
import { PerformanceStatsModel } from '../model/performance-stats.model';

@Component({
  moduleId: module.id,
  templateUrl: 'employee-performance.component.html'
})
export class EmployeePerformanceComponent implements OnInit {
  frmFilter: FormGroup;
  optionList: Array<any>;
  groupList: Array<any>;
  stateList: Array<CartStateModel>;
  chart: any;
  @ViewChild('canvasChartEl') canvasChartEl: ElementRef;

  constructor(
              private pageLoaderService: PageLoaderService,
              private notificationBar: NotificationBarService,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private performanceService: PerformanceService,
              private translate: TranslateService,
              private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadOptions();
    this.loadStates();
    this.loadGroups();
  }

  drawStats(chartData: any): void {
    const Chart = window['Chart'];
    const ctx = this.canvasChartEl.nativeElement.getContext('2d');

    if (!this.chart) {
      window['charty'] = this.chart = new Chart(ctx, {
        type: 'horizontalBar',
        data: chartData,
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                min: 0,
              }
            }]
          }
        }
      });
    } else {
      this.chart.data = chartData;
      this.chart.update();
    }
  }

  initForm(): void {
    const momentDateLocal = moment().local();
    momentDateLocal.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    const to = momentDateLocal.toDate();
    const from = momentDateLocal.add(-2, 'd').toDate();

    this.frmFilter = this.fb.group({
      group: [''],
      dateFrom: [from],
      dateTo: [to],
      option: [''],
    });

    this.frmFilter.valueChanges.subscribe(
      (filters) => {
        console.log('filters changed', filters);
        this.loadStats();
      }
    );
  }

  loadOptions(): void {
    const optionList = [{
      name: this.translate.instant('by cart quantity'),
      optionId: 1,
    }, {
      name: this.translate.instant('by total amount'),
      optionId: 2,
    }, {
      name: this.translate.instant('by product quantity'),
      optionId: 3,
    }];
    this.optionList = optionList;
    this.frmFilter.patchValue({
      option: 1
    }, { emitEvent: false });
  }

  loadStates(): void {
    this.cartService.getStates().subscribe(
      (states) => {
        this.stateList = states;
      },
      (err) => this.notificationBar.error(err)
    );
  }

  loadGroups(): void {
    this.performanceService.getGroups().subscribe(
      (groups) => {
        this.groupList = groups;
        this.frmFilter.patchValue({
          group: groups[0] && groups[0].groupId
        });
      },
      (err) => this.notificationBar.error(err)
    );
  }

  loadStats(): void {
    const filter = this.frmFilter.value;
    this.pageLoaderService.setPageLoadingStatus(true);
    this.performanceService.getStats(filter)
      .finally(() => this.pageLoaderService.setPageLoadingStatus(false))
      .subscribe(
        (stats) => {
          const data = this.createChartData(stats, this.stateList);
          this.drawStats(data);
        },
        (err) => this.notificationBar.error(err)
      );
  }

  createChartData(stats: Array<PerformanceStatsModel>, states: Array<CartStateModel>): any {
    const labels = [];
    const datasetsData = [];
    const datasetsLabel = [];
    const visibleStates = [{
        stateId: 6,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1
      }, {
        stateId: 5,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      }, {
        stateId: 4,
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
        borderColor: 'rgb(255, 205, 86)',
        borderWidth: 1
      }, {
        stateId: 3,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      }, {
        stateId: 2,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }];

    stats.forEach((stat) => {
      labels.push(stat.user);

      states.forEach((state) => {
        datasetsLabel[state.stateId] = state.name;
        datasetsData[state.stateId] = datasetsData[state.stateId] || [];
        datasetsData[state.stateId].push(stat['state' + state.stateId] || 0);
      });
    });

    const datasets = visibleStates.map((stateBar) => {
      return {
        ...stateBar,
        label: datasetsLabel[stateBar.stateId],
        data: datasetsData[stateBar.stateId]
      };
    });

    return {
      labels,
      datasets
    };
  }
}
