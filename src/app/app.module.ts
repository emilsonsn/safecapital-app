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
import { NativeDateAdapter, provideNativeDateAdapter } from '@angular/material/core';
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

export class CustomDateAdapter extends NativeDateAdapter {
  parse(value: any): Date | null {
    const str = value;
    if (str && typeof str === 'string') {
      const parts = str.split('/');
      if (parts.length === 3) {
        const day = Number(parts[0]);
        const month = Number(parts[1]) - 1;
        const year = Number(parts[2]);
        return new Date(year, month, day);
      }
    }
    return super.parse(value);
  }

  override deserialize(value: any): Date | null {
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return super.deserialize(value);
  }
}
