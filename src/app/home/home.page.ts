import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin,  { Draggable } from '@fullcalendar/interaction';
import { FirebaseService } from '../services/firebase.service';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { AddEventPage } from '../modals/add-event/add-event.page';
import { EventInfoPage } from '../modals/event-info/event-info.page';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar, OptionsInput } from '@fullcalendar/core';
import { Tooltip } from 'tooltips-js';
import { userInfo } from 'os';

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

  constructor(private firebaseService: FirebaseService,  private modalController: ModalController) {}

  ngOnInit() {
    // console.log(`MD: HomePage -> cal`, this.cal);

    this.firebaseService.events.subscribe(events => {
      this.events = events;
    });

  }

  dateClick(arg) {
    console.log(`MD: HomePage -> dateClick -> arg`, arg);
  }

  eventClick(arg) {
    // console.log(`MD: HomePage -> eventClick -> arg`, arg);
    this.presentEventInfoModal(arg);
  }

  eventDrop(e) {
    console.log(`MD: HomePage -> eventDrop -> e`, e);
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
  console.log(`MD: HomePage -> eventRender -> e`, e);
  const eventEl = e.el.querySelector('.fc-content');
  const linkIcon = document.createElement('i');
  // if user = admin.
  linkIcon.innerHTML = `<span style="margin: 0 10px; width: 30px; z-index:0;">edit icon</span>`;
  eventEl.appendChild(linkIcon);
  // Interferes with event resize
  //e.el.innerHTML = `<span style="margin: 0 10px; width: 30px; z-index:0;">edit icon</span> ${e.event.title}`;
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


  async presentAddEventModal() {
    const modal = await this.modalController.create({
      component:  AddEventPage,
      cssClass: 'add-event-modal' // Must be defined in global.scss
    });
    return await modal.present();
  }

  async presentEventInfoModal(arg) {
    console.log(`MD: HomePage -> presentEventInfoModal -> arg`, arg.event);
    const modal = await this.modalController.create({
      component:  EventInfoPage,
      componentProps: {
        event: arg.event,
      },
      cssClass: 'event-info-modal' // Must be defined in global.scss
    });
    return await modal.present();
  }

}
