import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BtgConnectionStatus, BtgIntegration } from '@models/btg-integration';
import { BtgIntegrationService } from '@services/btg-integration.service';
import { HeaderService } from '@services/header.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({ selector: 'app-btg-integration', templateUrl: './btg-integration.component.html', styleUrl: './btg-integration.component.scss' })
export class BtgIntegrationComponent implements OnInit {
  protected integration: BtgIntegration | null = null;
  protected loading = false; protected actionLoading = false;
  private readonly labels: Record<BtgConnectionStatus, string> = { CONNECTED: 'Conta conectada', EXPIRED: 'Autorização expirada', ERROR: 'Erro na integração', REVOKED: 'Acesso revogado', DISCONNECTED: 'Conta desconectada' };

  constructor(private readonly service: BtgIntegrationService, header: HeaderService, private readonly toastr: ToastrService, private readonly route: ActivatedRoute, private readonly router: Router, private readonly dialog: MatDialog) {
    header.setTitle('Integração BTG'); header.setSubTitle('Autorize e acompanhe a conta bancária da Safe Capital.');
  }
  ngOnInit(): void { this.handleCallback(); this.load(); }
  protected get statusLabel(): string { return this.integration ? this.labels[this.integration.connection_status] : 'Conta não conectada'; }
  protected get statusClass(): string { if (this.integration?.connection_status === 'CONNECTED') return 'connected'; if (['EXPIRED', 'ERROR', 'REVOKED'].includes(this.integration?.connection_status ?? '')) return 'error'; return 'disconnected'; }
  protected load(): void { this.loading = true; this.service.get().pipe(finalize(() => this.loading = false)).subscribe({ next: ({ data }) => this.integration = data ?? null, error: e => this.showError(e, 'Não foi possível consultar a integração BTG.') }); }
  protected connect(): void { this.actionLoading = true; this.service.connect().pipe(finalize(() => this.actionLoading = false)).subscribe({ next: ({ data }) => data?.authorization_url ? window.location.assign(data.authorization_url) : this.toastr.error('A API não retornou a URL de autorização do BTG.'), error: e => this.showError(e, 'Não foi possível iniciar a autorização no BTG.') }); }
  protected refresh(): void { this.actionLoading = true; this.service.refresh().pipe(finalize(() => this.actionLoading = false)).subscribe({ next: ({ message }) => { this.toastr.success(message ?? 'Token BTG renovado com sucesso.'); this.load(); }, error: e => this.showError(e, 'Não foi possível renovar a autorização BTG.') }); }
  protected confirmDisconnect(): void { this.dialog.open(DialogConfirmComponent, { data: { text: 'Deseja desconectar a conta BTG? Uma nova autorização será necessária para reativar a integração.' } }).afterClosed().subscribe(ok => { if (ok) this.disconnect(); }); }
  private disconnect(): void { this.actionLoading = true; this.service.disconnect().pipe(finalize(() => this.actionLoading = false)).subscribe({ next: ({ message }) => { this.toastr.success(message ?? 'Integração BTG desconectada.'); this.load(); }, error: e => this.showError(e, 'Não foi possível desconectar a integração BTG.') }); }
  private handleCallback(): void { const status = this.route.snapshot.queryParamMap.get('btg_status'); if (!status) return; status === 'success' ? this.toastr.success('Conta BTG conectada com sucesso.') : this.toastr.error(this.route.snapshot.queryParamMap.get('btg_message') || 'Não foi possível conectar a conta BTG.'); this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true }); }
  private showError(error: any, fallback: string): void { this.toastr.error(error?.error?.error ?? error?.error?.message ?? fallback); }
}
