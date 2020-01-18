import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
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
  // @ViewChild('external',  {static: true}) external: ElementRef;

  calendarPlugins = [
    dayGridPlugin,
    interactionPlugin,
  ];

  events: any[] = [];
  // currentEvent: unknown;

  constructor(private firebaseService: FirebaseService,  private modalController: ModalController, private eventService: EventService) {}

  ngOnInit() {
    // console.log(`MD: HomePage -> cal`, this.cal);
    // this.eventService.currentEvent$.pipe(take(1)).subscribe(event => this.currentEvent = event);

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
    // const title = e.event.title;
    const start = this.formatDate(e.event.start);
    const end = this.formatDate(e.event.end);
    const updatedEvent = {
      start,
      end
    };
    this.firebaseService.eventsCollection.doc(e.event.extendedProps.docId).update(updatedEvent);
  }

  eventRender(e){
    const eventEl = e.el.querySelector('.fc-content');
    const linkIcon = document.createElement('i');
    // if user = admin.
    linkIcon.innerHTML = `<span style="margin: 0 10px; width: 30px; z-index:999;">edit icon</span>`;
    eventEl.appendChild(linkIcon);
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

  formatDate(date: string) {
    return moment(date).format('YYYY-MM-DD');
  }

  formatDateTime(date: string) {
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  // Read-only or edit this event depending on user's role.
  async presentEventModal(arg, isSelectingDays) {
    const modal = await this.modalController.create({
      component:  EventPage,
      componentProps: {
        event: arg,
        isSelectingDays,
      },
      cssClass: 'add-event-modal' // Must be defined in global.scss
    });
    return await modal.present();
  }

  select(info) {
    this.presentEventModal(info, true);
  }

}
