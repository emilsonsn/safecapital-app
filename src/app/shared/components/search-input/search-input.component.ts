import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  protected form: FormGroup;

  @Output()
  public onSearchInputChanged = new EventEmitter<string>();

  public search: FormControl = new FormControl('');

  public showFilter: boolean = false;

  constructor(private readonly _fb: FormBuilder) {}

  ngOnInit() {
    this.form = this._fb.group({
      search: [''],
    });

    this.form
      .get('search')
      .valueChanges.subscribe((res) => this.emitSearchInput());
  }

  protected emitSearchInput() {
    setTimeout(() => {
      this.onSearchInputChanged.emit(this.form.get('search').value);
    }, 500);
  }
}
