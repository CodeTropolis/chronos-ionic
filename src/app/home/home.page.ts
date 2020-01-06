import { Component, ViewChild, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FirebaseService } from '../services/firebase.service';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { AddEventPage } from '../modals/add-event/add-event.page';

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

  constructor(private firebaseService: FirebaseService,  private modalController: ModalController) {}

  ngOnInit() {
    this.firebaseService.events.subscribe(events => {
      this.events = events;
    });
  }

  dateClick(arg) {
    console.log(`MD: HomePage -> dateClick -> arg`, arg);
  }

  eventClick(arg) {
    console.log(`MD: HomePage -> eventClick -> arg`, arg);
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

  eventResizeStop(e){}

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

}
