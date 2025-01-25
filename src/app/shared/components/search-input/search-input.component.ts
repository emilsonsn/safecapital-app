import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

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
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        this.onSearchInputChanged.emit(value);
      });
  }

  protected clear() {
    this.search.patchValue('');
    this.form.get('search').patchValue('');
    this.form.get('search').markAsPristine();
    this.form.get('search').updateValueAndValidity();
    this.showFilter = false;
    this.onSearchInputChanged.emit('');
  }

  protected get searchValue() : string {
    return this.form.get('search').value;
  }

  // protected emitSearchInput() {
  //   setTimeout(() => {
  //     this.onSearchInputChanged.emit(this.form.get('search').value);
  //   }, 500);
  // }
}
