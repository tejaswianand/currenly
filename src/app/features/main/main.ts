import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMoneyBillTransfer,
  faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  filter,
  startWith,
  finalize,
  map,
  catchError,
  of
} from 'rxjs';
import { Counter } from '../../core/services/counter';
import { Currency } from '../../core/services/currency';
import { Auth } from '../../core/services/auth';
import { FieldLabelComponent } from '../../shared/component/field-label/field-label';
import { InputComponent } from '../../shared/component/input/input';
import { ButtonComponent } from '../../shared/component/button/button';
import { SelectComponent } from '../../shared/component/select/select';
import { DatePickerComponent } from '../../shared/component/date-picker/date-picker';
import { sortRates } from './utils/sort.utils';
import { computeConversion, computeRebasedRates } from './helpers/currency.helper';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DecimalPipe,
    FontAwesomeModule,
    FieldLabelComponent,
    InputComponent,
    ButtonComponent,
    SelectComponent,
    DatePickerComponent
  ],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main implements OnInit {
  private fb = inject(FormBuilder);
  private counterService = inject(Counter);
  private currencyService = inject(Currency);
  private toastr = inject(ToastrService);
  private auth = inject(Auth);

  faBrand = faMoneyBillTransfer;
  faLogout = faRightFromBracket;

  currencies = ['EUR', 'INR', 'USD', 'GBP', 'AUD', 'CAD', 'JPY', 'CNY'];
  maxDate = new Date().toISOString().split('T')[0];

  sortColumn: 'currency' | 'rate' = 'currency';
  sortDirection: 'asc' | 'desc' = 'asc';

  form: FormGroup = this.fb.group({
    amount: [1],
    fromCode: ['EUR'],
    toCode: ['INR'],
    historyBase: ['EUR'],
    historyDate: [''],
    search: ['']
  });

  result = 0;
  rateDisplay = '';
  loadingConvert = false;

  historyData: Record<string, number> | null = null;
  loadingHistory = false;

  apiCalls = this.counterService.count$;

  ngOnInit(): void {
    this.setupAutoConversion();
  }

  logout(): void {
    this.auth.logout();
  }

  private setupAutoConversion(): void {
    const amount$ = this.form.get('amount')!.valueChanges.pipe(
      startWith(this.form.value.amount)
    );

    const from$ = this.form.get('fromCode')!.valueChanges.pipe(
      startWith(this.form.value.fromCode)
    );

    const to$ = this.form.get('toCode')!.valueChanges.pipe(
      startWith(this.form.value.toCode)
    );

    amount$
      .pipe(
        debounceTime(400),
        filter(amount => !!amount && amount > 0),
        switchMap(amount =>
          from$.pipe(
            switchMap(from =>
              to$.pipe(
                switchMap(to => {
                  this.loadingConvert = true;
                  return this.currencyService.getLive().pipe(
                    map(quotes =>
                      computeConversion(quotes, from, to, amount)
                    ),
                    finalize(() => (this.loadingConvert = false)),
                    catchError(() => of(null))
                  );
                })
              )
            )
          )
        )
      )
      .subscribe(result => {
        if (!result || !result.valid) {
          this.result = 0;
          this.rateDisplay = '';
          return;
        }

        this.result = result.amount;
        this.rateDisplay = result.display;
      });
  }


  fetchHistory(): void {
    const date = this.form.value.historyDate;

    if (!date) {
      this.toastr.warning('Please select a date.');
      return;
    }

    if (date > this.maxDate) {
      this.toastr.warning('Future dates are not allowed.');
      return;
    }

    this.loadingHistory = true;

    this.currencyService.getHistory(date).pipe(
      map(quotes =>
        computeRebasedRates(
          quotes,
          this.form.value.historyBase
        )
      ),
      finalize(() => (this.loadingHistory = false)),
      catchError(() => {
        this.toastr.error('Failed to fetch historical data.');
        return of(null);
      })
    ).subscribe(result => {
      if (!result) return;
      if (!result.valid) {
        this.toastr.warning('Selected base currency not available.');
        return;
      }
      this.historyData = result.rates;
      this.toastr.success('Historical data loaded successfully.');
    });
  }

  sortBy(column: 'currency' | 'rate'): void {
    if (this.sortColumn === column) {
      this.sortDirection =
        this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  get filteredAndSortedHistory() {
    if (!this.historyData) return [];
    const search = this.form.value.search?.toLowerCase() || '';
    const entries = Object.entries(this.historyData)
      .map(([key, value]) => ({ key, value }))
      .filter(e => e.key.toLowerCase().includes(search));
    return sortRates(entries, this.sortColumn, this.sortDirection);
  }
}
