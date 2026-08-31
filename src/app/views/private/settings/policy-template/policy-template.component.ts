import { Component, ElementRef, ViewChild } from '@angular/core';
import { PolicyTemplateConfiguration } from '@models/policy-template';
import { HeaderService } from '@services/header.service';
import { PolicyTemplateService } from '@services/policy-template.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-policy-template',
  templateUrl: './policy-template.component.html',
  styleUrl: './policy-template.component.scss',
})
export class PolicyTemplateComponent {
  @ViewChild('documentInput') documentInput?: ElementRef<HTMLInputElement>;

  protected configuration?: PolicyTemplateConfiguration;
  protected selectedFile?: File;
  protected loading = false;
  protected saving = false;
  protected downloading = false;

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _policyTemplateService: PolicyTemplateService,
    private readonly _toastr: ToastrService
  ) {
    this._headerService.setTitle('Template do Contrato');
    this._headerService.setSubTitle('Consulte e atualize o documento usado para gerar os contratos.');
  }

  ngOnInit(): void {
    this.loadCurrentTemplate();
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.selectedFile = undefined;
      return;
    }

    if (!file.name.toLowerCase().endsWith('.docx')) {
      this._toastr.error('Selecione um arquivo DOCX.');
      input.value = '';
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      this._toastr.error('O arquivo deve ter no máximo 20 MB.');
      input.value = '';
      return;
    }

    this.selectedFile = file;
  }

  protected save(): void {
    if (!this.selectedFile || this.saving) {
      this._toastr.error('Selecione o novo template em DOCX.');
      return;
    }

    const data = new FormData();
    data.append('document', this.selectedFile);
    this.saving = true;

    this._policyTemplateService
      .store(data)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (response) => {
          this.configuration = response.data;
          this.selectedFile = undefined;

          if (this.documentInput) {
            this.documentInput.nativeElement.value = '';
          }

          this._toastr.success(response.message);
        },
        error: (error) => {
          this._toastr.error(error.error?.error ?? 'Não foi possível atualizar o template.');
        },
      });
  }

  protected download(): void {
    if (!this.configuration || this.downloading) {
      return;
    }

    this.downloading = true;

    this._policyTemplateService
      .downloadCurrent()
      .pipe(finalize(() => (this.downloading = false)))
      .subscribe({
        next: (document) => {
          const url = URL.createObjectURL(document);
          const link = window.document.createElement('a');
          link.href = url;
          link.download = this.configuration!.template.filename;
          link.click();
          URL.revokeObjectURL(url);
        },
        error: () => {
          this._toastr.error('Não foi possível baixar o template atual.');
        },
      });
  }

  private loadCurrentTemplate(): void {
    this.loading = true;

    this._policyTemplateService
      .getCurrent()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.configuration = response.data;
        },
        error: (error) => {
          this._toastr.error(error.error?.error ?? 'Não foi possível carregar o template.');
        },
      });
  }
}
