import {DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import player from 'lottie-web';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {ToastrModule} from "ngx-toastr";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {provideLottieOptions} from "ngx-lottie";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideNgxMask } from 'ngx-mask';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig, CurrencyMaskModule } from 'ng2-currency-mask';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from '@services/auth-interceptor.service';
import { BrowserstateInterceptor } from './interceptors/browserstate.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';

registerLocaleData(localePt, 'pt-BR');

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: "."
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatMomentDateModule,
    HttpClientModule,
    CurrencyMaskModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right'
    }),
    NgbModule,
  ],
  providers: [
    provideLottieOptions({
      player: () => player,
    }),
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'BRL'
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        subscriptSizing: 'dynamic',
      }
    },
    // {
    //   provide: DATE_PIPE_DEFAULT_OPTIONS,
    //   useValue: {timezone: '-0300'}
    // },
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: BrowserstateInterceptor, multi: true },
    provideAnimationsAsync(),
    provideAnimations(),
    provideNativeDateAdapter(),
    provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
