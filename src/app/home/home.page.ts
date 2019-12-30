import { Component, ViewChild, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
//https://www.npmjs.com/package/@fullcalendar/interaction
import interactionPlugin from '@fullcalendar/interaction';
import { FirebaseService } from '../services/firebase.service';
// import momentPlugin from '@fullcalendar/moment';
// import { toMoment, toDuration } from '@fullcalendar/moment';
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
    // momentPlugin
  ];
  events: any[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.events.subscribe(events => {
      this.events = events;
      console.log(`MD: HomePage -> ngOnInit -> events`, events);
    });
  }

  handleDateClick(arg) {}

  eventDragStop(e) {}

  eventDrop(e) {
    // const eStart = moment(e.event.start).format('YYYY-MM-DD HH:mm');
    const start = moment(e.event.start).format('YYYY-MM-DD');
    const end = moment(e.event.end).format('YYYY-MM-DD');
    const updatedEvent = {
      start,
      end
    };
    this.firebaseService.eventsCollection.doc(e.event.extendedProps.docId).update(updatedEvent);
  }

  eventResizeStop(e){
    // console.log('eventResizeStop: ', e);
  }

  eventResize(e) {
    console.log(`MD: HomePage -> eventResize -> info`, e);
    const end = moment(e.event.end).format('YYYY-MM-DD');
    const updatedEvent = {
      end
    };
    this.firebaseService.eventsCollection.doc(e.event.extendedProps.docId).update(updatedEvent);
  }

}
