import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  eventsCollection: AngularFirestoreCollection<any[]>;
  events: Observable<any[]>;

  constructor(private db: AngularFirestore) {
    this.eventsCollection =  this.db.collection('events');
    this.events = this.db.collection('events').valueChanges({idField: 'docId' });

  }
}
