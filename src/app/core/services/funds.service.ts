import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fund } from '../models/fund.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FundsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/funds`;

  getFunds(): Observable<Fund[]> {
    return this.http.get<Fund[]>(this.apiUrl);
  }
}
