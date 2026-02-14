import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environments } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class Currency {
  private http = inject(HttpClient);
  private url = environments.apiUrl;
  private key = environments.apiKey;

  getLive() {
    const params = new HttpParams()
      .set('access_key', this.key)
      .set('source', 'USD')
      .set('format', '1');

    return this.http
      .get<any>(`${this.url}live`, { params })
      .pipe(map(res => res.quotes));
  }

  getHistory(date: string) {
    const params = new HttpParams()
      .set('access_key', this.key)
      .set('date', date)
      .set('source', 'USD')
      .set('format', '1');

    return this.http
      .get<any>(`${this.url}historical`, { params })
      .pipe(map(res => res.quotes));
  }
}