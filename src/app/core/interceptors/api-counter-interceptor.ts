import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Counter } from '../services/counter';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';

export const apiCounterInterceptor: HttpInterceptorFn = (req, next) => {
  const counterService = inject(Counter);

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        counterService.increment();
      }
    })
  );
};
