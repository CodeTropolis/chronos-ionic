import { Component, ViewChild, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
//https://www.npmjs.com/package/@fullcalendar/interaction
import interactionPlugin from '@fullcalendar/interaction';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  calendarPlugins = [dayGridPlugin, interactionPlugin];
  events: any[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.events.subscribe(events => {
      this.events = events;
      console.log(`MD: HomePage -> ngOnInit -> events`, events);
    });
  }

  handleDateClick(arg) {
    // alert(arg.dateStr);
  }

  eventDragStop(e) {
    console.log(`drag stop:`, e);
    // this.firebaseService.eventsCollection.doc(e.event.extendedProps.docId).update({start: e.event.start, end: e.event.end});
  }

  eventResizeStop(e){
    console.log('eventResizeStop: ', e);
  }

}
