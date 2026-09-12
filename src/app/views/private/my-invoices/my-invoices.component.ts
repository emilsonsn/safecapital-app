import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminInvoice, InvoiceStatus } from '@models/admin-finance';
import { MyInvoiceService } from '@services/my-invoice.service';
import { HeaderService } from '@services/header.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { InvoiceDetailDialogComponent } from './invoice-detail-dialog/invoice-detail-dialog.component';

@Component({
  selector: 'app-my-invoices',
  templateUrl: './my-invoices.component.html',
  styleUrl: './my-invoices.component.scss',
})
export class MyInvoicesComponent implements OnInit {
  protected invoices: AdminInvoice[] = [];
  protected loading = false;
  protected year: number | null = new Date().getFullYear();
  protected readonly years: number[] = Array.from(
    { length: 6 },
    (_, i) => new Date().getFullYear() - i,
  );
  protected page = 1;
  protected perPage = 15;
  protected total = 0;

  constructor(
    private readonly service: MyInvoiceService,
    private readonly dialog: MatDialog,
    header: HeaderService,
    private readonly toastr: ToastrService,
  ) {
    header.setTitle('Minhas faturas');
    header.setSubTitle(
      'Acompanhe suas faturas mensais, visualize o boleto e o detalhamento por contrato.',
    );
  }

  ngOnInit(): void {
    this.load();
  }

  protected onYearChange(value: string): void {
    this.year = value ? Number(value) : null;
    this.page = 1;
    this.load();
  }

  protected pageEvent(event: any): void {
    this.page = event.pageIndex + 1;
    this.perPage = event.pageSize;
    this.load();
  }

  protected statusLabel(status: InvoiceStatus): string {
    return {
      OPEN: 'Em aberto',
      PAID: 'Paga',
      OVERDUE: 'Vencida',
      CANCELLED: 'Cancelada',
    }[status];
  }

  protected open(invoice: AdminInvoice): void {
    this.dialog.open(InvoiceDetailDialogComponent, {
      width: 'min(92vw, 640px)',
      data: { invoice },
    });
  }

  protected load(): void {
    this.loading = true;
    this.service
      .list({
        year: this.year ?? undefined,
        page: this.page,
        per_page: this.perPage,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ data }) => {
          this.invoices = data.data;
          this.total = data.total;
          this.page = data.current_page;
        },
        error: (e) =>
          this.toastr.error(
            e?.error?.error ??
              e?.error?.message ??
              'Não foi possível carregar suas faturas.',
          ),
      });
  }
}
