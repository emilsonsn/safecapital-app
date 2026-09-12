import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FinanceClient } from '@models/admin-finance';
import { AdminFinanceService } from '@services/admin-finance.service';
import { HeaderService } from '@services/header.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, finalize, Subject } from 'rxjs';

@Component({
  selector: 'app-finance-clients',
  templateUrl: './finance-clients.component.html',
  styleUrl: '../finance.scss',
})
export class FinanceClientsComponent implements OnInit {
  protected clients: FinanceClient[] = [];
  protected loading = false;
  protected closing = false;
  protected search = '';
  protected page = 1;
  protected perPage = 15;
  protected total = 0;
  private readonly searchChanges = new Subject<string>();
  constructor(
    private readonly service: AdminFinanceService,
    private readonly router: Router,
    header: HeaderService,
    private readonly toastr: ToastrService,
  ) {
    header.setTitle('Faturas de clientes');
    header.setSubTitle(
      'Acompanhe a situação financeira e acesse as faturas de cada cliente.',
    );
  }
  ngOnInit(): void {
    this.searchChanges
      .pipe(debounceTime(350), distinctUntilChanged())
      .subscribe(() => {
        this.page = 1;
        this.load();
      });
    this.load();
  }
  protected onSearch(value: string): void {
    this.search = value;
    this.searchChanges.next(value);
  }
  protected pageEvent(event: any): void {
    this.page = event.pageIndex + 1;
    this.perPage = event.pageSize;
    this.load();
  }
  protected open(client: FinanceClient): void {
    this.router.navigate(['/painel/finance/clients', client.id, 'invoices']);
  }
  protected closeBatch(): void {
    if (this.closing) return;
    if (
      !confirm(
        'Fechar o lote de faturas do período atual? Essa ação gera os boletos consolidados e envia por e-mail para as imobiliárias.',
      )
    )
      return;
    this.closing = true;
    this.service
      .closeBatch()
      .pipe(finalize(() => (this.closing = false)))
      .subscribe({
        next: ({ message }) => {
          this.toastr.success(
            message ?? 'Lote de faturas fechado com sucesso.',
          );
          this.load();
        },
        error: (e) =>
          this.toastr.error(
            e?.error?.message ?? 'Não foi possível fechar o lote de faturas.',
          ),
      });
  }
  protected load(): void {
    this.loading = true;
    this.service
      .clients(this.search.trim(), this.page, this.perPage)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ data }) => {
          this.clients = data.data;
          this.total = data.total;
          this.page = data.current_page;
        },
        error: (e) =>
          this.toastr.error(
            e?.error?.error ?? 'Não foi possível carregar os clientes.',
          ),
      });
  }
}
