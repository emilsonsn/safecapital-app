import { Component } from '@angular/core';
import { TermDocument } from '@models/term-document';
import { HeaderService } from '@services/header.service';
import { TermDocumentService } from '@services/term-document.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss',
})
export class TermsComponent {
  protected currentTerm?: TermDocument;
  protected selectedFile?: File;
  protected loading = false;
  protected saving = false;

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _termDocumentService: TermDocumentService,
    private readonly _toastr: ToastrService
  ) {
    this._headerService.setTitle('Termo de Uso');
    this._headerService.setSubTitle('Consulte e atualize o documento apresentado aos clientes.');
  }

  ngOnInit(): void {
    this.loadCurrentTerm();
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.selectedFile = undefined;
      return;
    }

    if (file.type !== 'application/pdf') {
      this._toastr.error('Selecione um arquivo PDF.');
      input.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this._toastr.error('O arquivo deve ter no máximo 10 MB.');
      input.value = '';
      return;
    }

    this.selectedFile = file;
  }

  protected save(): void {
    if (!this.selectedFile || this.saving) {
      this._toastr.error('Selecione o novo termo em PDF.');
      return;
    }

    const data = new FormData();
    data.append('document', this.selectedFile);
    this.saving = true;

    this._termDocumentService
      .store(data)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (response) => {
          this.currentTerm = response.data;
          this.selectedFile = undefined;
          this._toastr.success(response.message);
        },
        error: (error) => {
          this._toastr.error(error.error?.error ?? 'Não foi possível atualizar o termo.');
        },
      });
  }

  private loadCurrentTerm(): void {
    this.loading = true;

    this._termDocumentService
      .getCurrent()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.currentTerm = response.data;
        },
        error: (error) => {
          this._toastr.error(error.error?.error ?? 'Não foi possível carregar o termo.');
        },
      });
  }
}
