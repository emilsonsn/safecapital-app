import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AdminInvoice,
  FinanceClientSummary,
  InvoiceStatus,
} from '@models/admin-finance';
import { AdminFinanceService } from '@services/admin-finance.service';
import { HeaderService } from '@services/header.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { ManualPaymentDialogComponent } from '../manual-payment-dialog/manual-payment-dialog.component';

@Component({
  selector: 'app-client-invoices',
  templateUrl: './client-invoices.component.html',
  styleUrl: '../finance.scss',
})
export class ClientInvoicesComponent implements OnInit {
  protected invoices: AdminInvoice[] = [];
  protected client: FinanceClientSummary | null = null;
  protected loading = false;
  protected expanded: number | null = null;
  protected status = '';
  protected dueFrom = '';
  protected dueTo = '';
  protected page = 1;
  protected perPage = 15;
  protected total = 0;
  protected readonly statuses: { value: '' | InvoiceStatus; label: string }[] =
    [
      { value: '', label: 'Todas' },
      { value: 'OPEN', label: 'Em aberto' },
      { value: 'OVERDUE', label: 'Vencidas' },
      { value: 'PAID', label: 'Pagas' },
      { value: 'CANCELLED', label: 'Canceladas' },
    ];
  protected readonly changeableStatuses: {
    value: 'OPEN' | 'OVERDUE' | 'PAID' | 'CANCELLED';
    label: string;
  }[] = [
    { value: 'OPEN', label: 'Em aberto' },
    { value: 'OVERDUE', label: 'Vencida' },
    { value: 'PAID', label: 'Paga' },
    { value: 'CANCELLED', label: 'Cancelada' },
  ];
  protected changingStatusId: number | null = null;
  protected uploadingProofId: number | null = null;
  private userId: number;
  constructor(
    route: ActivatedRoute,
    protected readonly router: Router,
    private readonly service: AdminFinanceService,
    private readonly dialog: MatDialog,
    header: HeaderService,
    private readonly toastr: ToastrService,
  ) {
    this.userId = Number(route.snapshot.paramMap.get('userId'));
    header.setTitle('Faturas do cliente');
    header.setSubTitle('Consulte boletos, parcelas e registros de pagamento.');
  }
  ngOnInit(): void {
    if (!Number.isInteger(this.userId) || this.userId < 1) {
      this.router.navigate(['/painel/finance/invoices']);
      return;
    }
    this.load();
  }
  protected selectStatus(status: string): void {
    this.status = status;
    this.page = 1;
    this.load();
  }
  protected applyDates(): void {
    this.page = 1;
    this.load();
  }
  protected clearDates(): void {
    this.dueFrom = '';
    this.dueTo = '';
    this.applyDates();
  }
  protected pageEvent(e: any): void {
    this.page = e.pageIndex + 1;
    this.perPage = e.pageSize;
    this.load();
  }
  protected toggle(id: number): void {
    this.expanded = this.expanded === id ? null : id;
  }
  protected statusLabel(status: InvoiceStatus): string {
    return {
      OPEN: 'Em aberto',
      PAID: 'Paga',
      OVERDUE: 'Vencida',
      CANCELLED: 'Cancelada',
    }[status];
  }
  protected pay(invoice: AdminInvoice): void {
    this.dialog
      .open(ManualPaymentDialogComponent, {
        width: 'min(92vw, 560px)',
        data: { invoice, userId: this.userId },
      })
      .afterClosed()
      .subscribe((ok) => {
        if (ok) this.load();
      });
  }
  protected copy(value: string | null): void {
    if (!value) return;
    navigator.clipboard
      .writeText(value)
      .then(() => this.toastr.success('Linha digitável copiada.'));
  }
  protected changeStatus(invoice: AdminInvoice, value: string): void {
    const newStatus = value as 'OPEN' | 'OVERDUE' | 'PAID' | 'CANCELLED';
    if (newStatus === invoice.status) return;
    if (newStatus === 'PAID') {
      this.pay(invoice);
      return;
    }
    this.changingStatusId = invoice.id;
    this.service
      .updateStatus(this.userId, invoice.id, newStatus)
      .pipe(finalize(() => (this.changingStatusId = null)))
      .subscribe({
        next: ({ data, message }) => {
          Object.assign(invoice, data);
          this.toastr.success(message ?? 'Status atualizado.');
        },
        error: (e) =>
          this.toastr.error(
            e?.error?.message ??
              Object.values(e?.error?.errors ?? {})[0]?.[0] ??
              'Não foi possível atualizar o status.',
          ),
      });
  }
  protected uploadProof(invoice: AdminInvoice, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';
    if (!file) return;
    this.uploadingProofId = invoice.id;
    this.service
      .uploadProof(this.userId, invoice.id, file)
      .pipe(finalize(() => (this.uploadingProofId = null)))
      .subscribe({
        next: ({ data, message }) => {
          Object.assign(invoice, data);
          this.toastr.success(message ?? 'Comprovante enviado com sucesso.');
        },
        error: (e) =>
          this.toastr.error(
            e?.error?.message ??
              Object.values(e?.error?.errors ?? {})[0]?.[0] ??
              'Não foi possível enviar o comprovante.',
          ),
      });
  }
  protected load(): void {
    this.loading = true;
    this.service
      .invoices(this.userId, {
        status: this.status,
        due_from: this.dueFrom,
        due_to: this.dueTo,
        page: this.page,
        per_page: this.perPage,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (r) => {
          this.client = r.client;
          this.invoices = r.data.data;
          this.total = r.data.total;
          this.page = r.data.current_page;
        },
        error: (e) =>
          this.toastr.error(
            e?.error?.error ??
              e?.error?.message ??
              'Não foi possível carregar as faturas.',
          ),
      });
  }
}
