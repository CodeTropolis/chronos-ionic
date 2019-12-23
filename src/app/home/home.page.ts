import { Component, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
//https://www.npmjs.com/package/@fullcalendar/interaction
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  calendarPlugins = [dayGridPlugin, interactionPlugin];
  events = [
    { title: 'event 1', date: '2019-12-01' },
    { title: 'event 2', date: '2019-12-02' }
  ];

  constructor() {}

  handleDateClick(arg) { // handler method
    alert(arg.dateStr);
  }

  eventDragStop(e) {
    console.log(e);
  }

}
