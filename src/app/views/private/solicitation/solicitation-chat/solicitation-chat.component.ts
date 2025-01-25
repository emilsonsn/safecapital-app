import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { NavigationStart, Router } from '@angular/router';
import { Solicitation, SolicitationMessage } from '@models/solicitation';
import { User } from '@models/user';
import { SolicitationService } from '@services/solicitation.service';
import { SessionQuery } from '@store/session.query';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subscription } from 'rxjs';

@Component({
  selector: 'app-solicitation-chat',
  templateUrl: './solicitation-chat.component.html',
  styleUrl: './solicitation-chat.component.scss',
})
export class SolicitationChatComponent {
  protected messageText: string = '';
  protected loading: boolean = false;
  protected user : User;

  // Utils
  private routerSubscription!: Subscription;
  @ViewChild('messagesContainer') protected messagesContainer!: ElementRef;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    protected _data: { solicitation: Solicitation },
    private _bottomSheetRef: MatBottomSheetRef<SolicitationChatComponent>,
    private readonly _toastr: ToastrService,
    private readonly _solicitationService: SolicitationService,
    private readonly _sessionQuery : SessionQuery,
    private readonly _router: Router,
  ) {}

  ngOnInit() {
    this._sessionQuery.user$.subscribe((user) => {
      this.user = user;
    })

    this.routerSubscription = this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.closeChat();
      }
    });

  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }

  protected onSubmit() {
    if (this.loading) {
      return;
    }

    if (!this.messageText && !this.fileToSend) {
      this._toastr.error(
        'Por favor, preencha o campo de mensagem ou envie algum arquivo!'
      );
      return;
    }

    this._initOrStopLoading();

    this._solicitationService
      .createMessage(
        this.prepareFormData({
          id: null,
          attachment: this.fileToSend?.file,
          message: this.messageText,
          solicitation_id: this._data.solicitation.id,
        })
      )
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
          this.messageText = '';
          this.fileToSend = undefined;
        })
      )
      .subscribe({
        next: (res) => {
          this.getMessages();
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  protected prepareFormData(message: SolicitationMessage) {
    const formData = new FormData();

    formData.append('message', message.message);
    formData.append('solicitation_id', message.solicitation_id.toString());

    if (this.fileToSend) {
      formData.append(`attachment`, this.fileToSend.file);
    }

    return formData;
  }

  protected getMessages() {
    this._solicitationService.getById(this._data?.solicitation?.id)
      .subscribe((res) => {
        if(res) {
          this._data.solicitation.messages = res.data.messages;
        }
      })
  }

  // Files
  protected fileToSend: {
    preview: string;
    file: File;
  } = undefined;

  public allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
  ];

  public async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  public async onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const fileArray: File[] = Array.from(files);

    for (const file of fileArray) {
      if (this.allowedTypes.includes(file.type)) {
        let base64: string = null;

        if (file.type.startsWith('image/')) {
          base64 = await this.convertFileToBase64(file);
        }

        this.fileToSend = {
          preview: base64,
          file: file,
        };
      } else this._toastr.error(`${file.type} não é permitido`);
    }
  }

  // public removeFileFromSendToFiles(index: number) {
  //   if (index > -1) {
  //     this.fileToSend.splice(index, 1);
  //   }
  // }

  public removeFile() {
    this.fileToSend = undefined;
  }

  public openFileInAnotherTab(e) {
    const fileUrl = URL.createObjectURL(e.file);

    window.open(fileUrl, '_blank');
  }

  public openImgInAnotherTab(e) {
    window.open(e, '_blank');
  }

  // Utils

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  protected closeChat() {
    this._bottomSheetRef.dismiss();
  }

  protected _initOrStopLoading() {
    this.loading = !this.loading;
  }

  scrollToBottom(): void {
    if (this.messagesContainer) {
      try {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Erro ao rolar para o final:', err);
      }
    } else {
      console.warn('messagesContainer não está definido.');
    }
  }


}
