import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin,  { Draggable } from '@fullcalendar/interaction';
import { FirebaseService } from '../services/firebase.service';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { EventPage } from '../modals/event/event.page';
import { EventInfoPage } from '../modals/event-info/event-info.page';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar, OptionsInput } from '@fullcalendar/core';
import { Tooltip } from 'tooltips-js';
import { EventService } from '../services/event.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild(FullCalendarComponent, {static: true}) cal: FullCalendarComponent;
  calendarPlugins = [
    dayGridPlugin,
    interactionPlugin,
    timeGridPlugin,
  ];
  events: any[] = [];

  constructor(private firebaseService: FirebaseService,  private modalController: ModalController, private eventService: EventService) {}

  ngOnInit() {
    this.firebaseService.events.subscribe(events => {
      this.events = events;
    });

  }
  // dateClick(arg) {
  //   console.log(`MD: HomePage -> dateClick -> arg`, arg);
  // }

  eventClick(arg) {
    this.presentEventModal(arg, false);
  }

  eventDrop(e) {
    // console.log(`MD: HomePage -> eventDrop -> e`, e);
    // Must format start and end props, otherwise e.event.start will save as
    // Month DD YYYY at 2:00:00 PM UTC-6 which calendar will not recognize as currently configured (?)
    const sTime = e.event.start.getHours() + ':' + e.event.start.getMinutes();
    const start = this.formatDateTime(e.event.start, sTime); // i.e. grab 14:00 from e.event.start
    console.log(`MD: HomePage -> eventDrop -> start`, start);
    const eTime = e.event.end.getHours() + ':' + e.event.end.getMinutes();
    const end = this.formatDateTime(e.event.end, eTime);
    console.log(`MD: HomePage -> eventDrop -> end`, end);
    const updatedEvent = {
      start,
      end,
    };
    this.firebaseService.eventsCollection.doc(e.event.extendedProps.docId).update(updatedEvent);
  }

  eventRender(e) {
    // const eventEl = e.el.querySelector('.fc-content');
    // const linkIcon = document.createElement('i');
    // // if user = admin.
    // linkIcon.innerHTML = `<span style="margin: 0 10px; width: 30px; z-index:999;">edit icon</span>`;
    // eventEl.appendChild(linkIcon);
    // Altering e.el.innerHTML will interfere with event resize
  }

  eventDragStop(e) {}

  eventResize(e) {
    const end = this.formatDate(e.event.end);
    const updatedEvent = {
      end
    };
    this.firebaseService.eventsCollection.doc(e.event.extendedProps.docId).update(updatedEvent);
  }

  eventResizeStop(e) {}

  select(info) {
    this.presentEventModal(info, true);
  }

  formatDate(date: string) {
    return moment(date).format('YYYY-MM-DD');
  }

  formatDateTime(date: string, time) {
    // const mTime = moment(time, ['h:mm A']).format('HH:mm');
    const fDate = moment(date).format('YYYY-MM-DD');
    const dateTime = moment(fDate + ' ' + time, 'YYYY/MM/DD HH:mm');
    const dtf = dateTime.format('YYYY-MM-DDTHH:mm');
    return dtf;
  }

  // formatDateTime(date: string) {
  //   return moment(date).format('YYYY-MM-DD HH:mm');
  // }

  // Read-only or edit this event depending on user's role.
  async presentEventModal(arg, isSelectingDays: boolean) {
    const modal = await this.modalController.create({
      component:  EventPage,
      componentProps: {
        arg,
        isSelectingDays,
      },
      cssClass: 'add-event-modal' // Must be defined in global.scss
    });
    return await modal.present();
  }

}
