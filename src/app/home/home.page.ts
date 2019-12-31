import { Component, ViewChild, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FirebaseService } from '../services/firebase.service';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  calendarPlugins = [
    dayGridPlugin,
    interactionPlugin,
  ];

  events: any[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.events.subscribe(events => {
      this.events = events;
    });
  }

  handleDateClick(arg) {}

  eventDragStop(e) {}

  eventDrop(e) {
    const start = this.momentDate(e.event.start);
    const end = this.momentDate(e.event.end);
    const updatedEvent = {
      start,
      end
    };
    this.firebaseService.eventsCollection.doc(e.event.extendedProps.docId).update(updatedEvent);
  }

  eventResize(e) {
    console.log(`MD: HomePage -> eventResize -> info`, e);
    const end = moment(e.event.end).format('YYYY-MM-DD');
    const updatedEvent = {
      end
    };
    this.firebaseService.eventsCollection.doc(e.event.extendedProps.docId).update(updatedEvent);
  }

  eventResizeStop(e){}

  momentDate(date) {
    return moment(date).format('YYYY-MM-DD');
  }

  momentDateTime(date) {
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

}
