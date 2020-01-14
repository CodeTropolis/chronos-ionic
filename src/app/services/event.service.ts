import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  currentEvent$ = new BehaviorSubject<any>(null);

  constructor() { }
}
