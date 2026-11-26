import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReadGoalService {
  constructor(private readonly http: HttpClient) {}

  async createGoal(title: string): Promise<void> {
    const now = new Date();
    const endDate = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');

    await firstValueFrom(this.http.post('http://localhost:7001/goals', {
      title,
      description: 'The book was reader',
      achieved: 100,
      endDate,
    }));

    window.dispatchEvent(new CustomEvent('goals:changed'));
  }
}
