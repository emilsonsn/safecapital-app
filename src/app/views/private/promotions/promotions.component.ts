import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { Promotion } from '@models/promotion';
import { AdminPromotionService } from '@services/admin-promotion.service';
import { HeaderService } from '@services/header.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { PromotionFormDialogComponent } from './promotion-form-dialog/promotion-form-dialog.component';

const PER_PAGE = 100;

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.scss',
})
export class PromotionsComponent implements OnInit {
  protected promotions: Promotion[] = [];
  protected loading = false;
  protected total = 0;

  constructor(
    private readonly service: AdminPromotionService,
    private readonly dialog: MatDialog,
    header: HeaderService,
    private readonly toastr: ToastrService,
  ) {
    header.setTitle('Promoções');
    header.setSubTitle(
      'Cadastre promoções para exibir na home das imobiliárias e arraste para reordenar.',
    );
  }

  ngOnInit(): void {
    this.load();
  }

  protected open(promotion?: Promotion): void {
    this.dialog
      .open(PromotionFormDialogComponent, {
        width: 'min(92vw, 560px)',
        data: { promotion },
      })
      .afterClosed()
      .subscribe((ok) => {
        if (ok) this.load();
      });
  }

  protected toggleActive(promotion: Promotion): void {
    const nextActive = !promotion.active;
    this.service.update(promotion.id, { active: nextActive }).subscribe({
      next: ({ data }) => {
        promotion.active = data.active;
        this.toastr.success(
          nextActive ? 'Promoção ativada.' : 'Promoção desativada.',
        );
      },
      error: (e) =>
        this.toastr.error(
          e?.error?.message ?? 'Não foi possível atualizar a promoção.',
        ),
    });
  }

  protected remove(promotion: Promotion): void {
    if (!confirm('Remover esta promoção?')) return;
    this.service.delete(promotion.id).subscribe({
      next: () => {
        this.toastr.success('Promoção removida.');
        this.load();
      },
      error: (e) =>
        this.toastr.error(
          e?.error?.message ?? 'Não foi possível remover a promoção.',
        ),
    });
  }

  protected drop(event: CdkDragDrop<Promotion[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(this.promotions, event.previousIndex, event.currentIndex);
    const ids = this.promotions.map((p) => p.id);

    this.service.reorder(ids).subscribe({
      error: (e) => {
        this.toastr.error(
          e?.error?.message ?? 'Não foi possível salvar a nova ordem.',
        );
        this.load();
      },
    });
  }

  protected load(): void {
    this.loading = true;
    this.service
      .list(1, PER_PAGE)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ data }) => {
          this.promotions = data.data;
          this.total = data.total;
        },
        error: (e) =>
          this.toastr.error(
            e?.error?.message ?? 'Não foi possível carregar as promoções.',
          ),
      });
  }
}
