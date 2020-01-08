import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin,  { Draggable } from '@fullcalendar/interaction';
import { FirebaseService } from '../services/firebase.service';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { AddEventPage } from '../modals/add-event/add-event.page';
import { EventInfoPage } from '../modals/event-info/event-info.page';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild(FullCalendarComponent, {static: true}) cal: FullCalendarComponent;
  @ViewChild(Element, {static: true}) draggable: Element;
  @ViewChild('external',  {static: true}) external: ElementRef;


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
    // tslint:disable-next-line: no-unused-expression
    new Draggable(this.external.nativeElement, {
      itemSelector: '.fc-event',
      eventData: (eventEl) => {
        // console.log(`MD: HomePage -> ngOnInit -> eventEl`, eventEl);
        return {
          title: eventEl.innerText
        };
      }
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
    const start = this.formatDate(e.event.start);
    const end = this.formatDate(e.event.end);
    const updatedEvent = {
      start,
      end
    };
    this.firebaseService.eventsCollection.doc(e.event.extendedProps.docId).update(updatedEvent);
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
