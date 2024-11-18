import {Component, computed, Signal, signal} from '@angular/core';
import {ISmallInformationCard} from "@models/cardInformation";
import {Chart, registerables} from "chart.js";
import {DashboardService} from "@services/dashboard.service";
import {ApiResponse} from "@models/application";
import {OrderData} from "@models/dashboard";
import {formatCurrency} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  dashboardCards = signal<OrderData>(
    {
      ordersByDay: 0,
      ordersByWeek: 0,
      ordersByMonth: 0,
      ordersByYear: 0,
      pendingOrders: 0,
      awaitingFinanceOrders: 0,
      solicitationPendings: 0,
      solicitationFinished: 0,
    }
  );

  constructor(private readonly _dashboardService: DashboardService) {
    _dashboardService.getDashboardCards().subscribe((c: ApiResponse<OrderData>) => {
      this.dashboardCards.set(c.data);
    });
  }

  itemsShopping: Signal<ISmallInformationCard[]> = computed<ISmallInformationCard[]>(() => [
    {
      icon: 'fa-solid fa-cart-plus',
      icon_description: 'fa-solid fa-calendar-day',
      background: '#FC9108',
      title: formatCurrency(+this.dashboardCards().ordersByDay.toString(), 'pt-BR', 'R$'),
      category: 'Compras',
      description: 'Total de compras do dia',
    },
    {
      icon: 'fa-solid fa-truck-fast',
      icon_description: 'fa-solid fa-calendar-week',
      background: '#4CA750',
      title: formatCurrency(+this.dashboardCards().ordersByWeek.toString(), 'pt-BR', 'R$'),
      category: 'Compras',
      description: 'Total de compras da semana',
    },
    {
      icon: 'fa-solid fa-shop',
      icon_description: 'fa-regular fa-calendar',
      background: '#E9423E',
      title: formatCurrency(+this.dashboardCards().ordersByMonth.toString(), 'pt-BR', 'R$'),
      category: 'Compras',
      description: 'Total de compras do mês',
    },
    {
      icon: 'fa-solid fa-money-check-dollar',
      icon_description: 'fa-solid fa-calendar',
      background: '#0AB2C7',
      title: formatCurrency(+this.dashboardCards().ordersByYear.toString(), 'pt-BR', 'R$'),
      category: 'Compras',
      description: 'Total de compras do ano',
    },
  ]);
  itemsRequests: Signal<ISmallInformationCard[]> = computed<ISmallInformationCard[]>(() => [
    {
      icon: 'fa-solid fa-clock',
      background: '#FC9108',
      title: this.dashboardCards().pendingOrders,
      category: 'Pedidos',
      description: 'Pedidos pendentes',
    },
    {
      icon: 'fa-solid fa-envelope-open',
      // icon_description: 'fa-solid fa-calendar-day',
      // background: '#17a2b8',
      title: this.dashboardCards().awaitingFinanceOrders,
      category: 'Pedidos',
      description: 'Solicitações em aberto',
    },
    {
      icon: 'fa-solid fa-calendar-times',
      // icon_description: 'fa-solid fa-calendar-day',
      background: '#dc3545',
      title: this.dashboardCards().solicitationPendings,
      category: 'Pedidos',
      description: 'Pedidos vencidos',
    }, {
      icon: 'fa-solid fa-check-circle',
      // icon_description: 'fa-solid fa-calendar-day',
      background: '#28a745',
      title: this.dashboardCards().solicitationFinished,
      category: 'Pedidos',
      description: 'Pedidos resolvidos',
    },
  ]);

  lineChart: any = {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Compras',
        data: [], // Dados de compras por mês
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    }
  };

  barChart: any = {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Pedidos',
        data: [10, 150, 180, 300, 170, 80, 240, 250, 150, 210, 180, 190], // Dados de compras por mês
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    }
  };
  filters: any = {
    is_home: true
  };

  ngOnInit() {
    Chart.register(...registerables);

    // Initialize the charts and store the instances
    // this.lineChart = new Chart('lineChart', this.lineChart);
    this.barChart = new Chart('barChart', this.barChart);

    this._dashboardService.getPurchaseGraphicBar().subscribe((c: ApiResponse<{ month: string, total: number }[]>) => {
      const months = c.data.map(d => d.month); // Extract months
      const totals = c.data.map(d => d.total); // Extract totals

      if (this.barChart && this.barChart instanceof Chart) {
        this.barChart.data.labels = months;
        this.barChart.data.datasets[0].data = totals;
        this.barChart.update(); // Update chart
      }
    });

    /*this._dashboardService.getPurchaseGraphicLine().subscribe((c: ApiResponse<{ month: string, total: number }[]>) => {
      const months = c.data.map(d => d.month); // Extract months
      const totals = c.data.map(d => d.total); // Extract totals

      // Ensure charts are initialized before updating
      if (this.lineChart && this.lineChart instanceof Chart) {
        this.lineChart.data.labels = months;
        this.lineChart.data.datasets[0].data = totals;
        this.lineChart.update(); // Update chart
      }
    });*/
  }



}
