import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminInvoice, InvoiceStatus } from '@models/admin-finance';
import { MyInvoiceService } from '@services/my-invoice.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

const INSTALLMENT_STATUS_LABELS: Record<string, string> = {
  OPEN: 'Em aberto',
  BOLETO_SENT: 'Boleto enviado',
  PAID: 'Pago',
  REMOVED: 'Removido',
  OVERDUE: 'Vencido',
  CANCELLED: 'Cancelado',
};

const MAX_PROOF_SIZE_BYTES = 10 * 1024 * 1024;

@Component({
  selector: 'app-invoice-detail-dialog',
  templateUrl: './invoice-detail-dialog.component.html',
  styleUrl: './invoice-detail-dialog.component.scss',
})
export class InvoiceDetailDialogComponent {
  protected uploading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: { invoice: AdminInvoice },
    protected readonly ref: MatDialogRef<InvoiceDetailDialogComponent>,
    private readonly service: MyInvoiceService,
    private readonly toastr: ToastrService,
  ) {}

  protected statusLabel(status: InvoiceStatus): string {
    return {
      OPEN: 'Em aberto',
      PAID: 'Paga',
      OVERDUE: 'Vencida',
      CANCELLED: 'Cancelada',
    }[status];
  }

  protected installmentStatusLabel(status: string): string {
    return INSTALLMENT_STATUS_LABELS[status] ?? status;
  }

  protected copy(value: string | null): void {
    if (!value) return;
    navigator.clipboard
      .writeText(value)
      .then(() => this.toastr.success('Linha digitável copiada.'));
  }

  protected canUploadProof(): boolean {
    return this.data.invoice.status !== 'CANCELLED';
  }

  protected onProofSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';
    if (!file) return;

    if (file.size > MAX_PROOF_SIZE_BYTES) {
      this.toastr.error('O arquivo deve ter no máximo 10MB.');
      return;
    }

    this.uploading = true;
    this.service
      .uploadProof(this.data.invoice.id, file)
      .pipe(finalize(() => (this.uploading = false)))
      .subscribe({
        next: ({ data, message }) => {
          this.data.invoice.payment_proof_url = data.payment_proof_url;
          this.data.invoice.payment_proof_uploaded_at =
            data.payment_proof_uploaded_at;
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
}
