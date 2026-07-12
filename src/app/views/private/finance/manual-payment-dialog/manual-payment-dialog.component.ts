import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminInvoice } from '@models/admin-finance';
import { AdminFinanceService } from '@services/admin-finance.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
@Component({selector:'app-manual-payment-dialog',templateUrl:'./manual-payment-dialog.component.html',styleUrl:'./manual-payment-dialog.component.scss'})
export class ManualPaymentDialogComponent { protected loading=false;protected form=this.fb.group({paid_at:[''],payment_reference:['',[Validators.maxLength(100)]],payment_notes:['',[Validators.maxLength(1000)]]});
  constructor(@Inject(MAT_DIALOG_DATA) protected data:{invoice:AdminInvoice;userId:number},private readonly fb:FormBuilder,private readonly service:AdminFinanceService,protected readonly ref:MatDialogRef<ManualPaymentDialogComponent>,private readonly toastr:ToastrService){}
  protected submit():void{if(this.form.invalid)return;this.loading=true;const raw=this.form.getRawValue();const payload={...(raw.paid_at?{paid_at:new Date(raw.paid_at).toISOString()}:{}),...(raw.payment_reference?.trim()?{payment_reference:raw.payment_reference.trim()}:{}),...(raw.payment_notes?.trim()?{payment_notes:raw.payment_notes.trim()}:{})};this.service.markAsPaid(this.data.userId,this.data.invoice.id,payload).pipe(finalize(()=>this.loading=false)).subscribe({next:r=>{this.toastr.success(r.message??'Fatura marcada como paga.');this.ref.close(true);},error:e=>this.toastr.error(e?.error?.error??e?.error?.message??Object.values(e?.error?.errors??{})[0]?.[0]??'Não foi possível registrar o pagamento.')});}
}
