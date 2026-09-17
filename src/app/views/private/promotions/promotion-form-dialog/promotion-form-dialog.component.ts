import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Promotion } from '@models/promotion';
import { AdminPromotionService } from '@services/admin-promotion.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

@Component({
  selector: 'app-promotion-form-dialog',
  templateUrl: './promotion-form-dialog.component.html',
  styleUrl: './promotion-form-dialog.component.scss',
})
export class PromotionFormDialogComponent {
  protected loading = false;
  protected form: FormGroup;
  protected imagePreview: string | null;
  protected selectedImage: File | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: { promotion?: Promotion },
    private readonly fb: FormBuilder,
    private readonly service: AdminPromotionService,
    protected readonly ref: MatDialogRef<PromotionFormDialogComponent>,
    private readonly toastr: ToastrService,
  ) {
    const promotion = data.promotion;
    this.form = this.fb.group({
      title: [promotion?.title ?? ''],
      text: [promotion?.text ?? ''],
      active: [promotion?.active ?? true],
    });
    this.imagePreview = promotion?.image_url ?? null;
  }

  protected onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      this.toastr.error('A imagem deve ter no máximo 5MB.');
      return;
    }

    this.selectedImage = file;
    this.imagePreview = URL.createObjectURL(file);
  }

  protected submit(): void {
    if (!this.imagePreview) {
      this.toastr.error('A imagem da promoção é obrigatória.');
      return;
    }

    const raw = this.form.getRawValue();
    const payload = {
      title: (raw.title ?? '').trim(),
      text: (raw.text ?? '').trim(),
      active: raw.active,
      ...(this.selectedImage ? { image: this.selectedImage } : {}),
    };

    this.loading = true;
    const call = this.data.promotion
      ? this.service.update(this.data.promotion.id, payload)
      : this.service.create(payload);

    call.pipe(finalize(() => (this.loading = false))).subscribe({
      next: () => {
        this.toastr.success('Promoção salva com sucesso.');
        this.ref.close(true);
      },
      error: (e) =>
        this.toastr.error(
          e?.error?.message ??
            Object.values(e?.error?.errors ?? {})[0]?.[0] ??
            'Não foi possível salvar a promoção.',
        ),
    });
  }
}
