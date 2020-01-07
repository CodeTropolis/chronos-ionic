import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.page.html',
  styleUrls: ['./event-info.page.scss'],
})
export class EventInfoPage implements OnInit {

  @Input() event: any;

  constructor() { }

  ngOnInit() {
    // console.log(this.event);
  }

}
