import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { EventService } from 'src/app/services/event.service';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'add-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  @Input() event: any;
  @Input() isSelectingDays: boolean;
  eventForm: FormGroup;

  types = [
    {value: 'private_party', display: 'Private Party', bgColor: '#3dc6ab'},
    {value: 'sports', display: 'Sports', bgColor: '#ea6759'},
    {value: 'st_luke', display: 'St. Luke', bgColor: '#aa72c1'},
    {value: 'st_teresa_parish', display: 'St. Teresa Parish', bgColor: '#53a7e0'},
    {value: 'school_event', display: 'St. Teresa School Event', bgColor: '#f4ab36'},
  ];

  locations = [
    {value: 'st_luke_church', display: 'St. Luke Church'},
    {value: 'st_luke_community_house', display: 'St. Luke Community House'},
    {value: 'st_luke_parish_center', display: 'St. Luke Parish Center'},
    {value: 'st_luke_room', display: 'St. Luke Room'},
    {value: 'st_teresa_church', display: 'St. Teresa Church'},
    {value: 'st_teresa_cafeteria', display: 'St. Teresa Cafeteria'},
    {value: 'st_teresa_parish_center', display: 'St. Teresa Parish Center'},
    {value: 'st_teresa_rectory', display: 'St. Teresa Rectory'},
    {value: 'st_teresa_school', display: 'St. Teresa School'},
    {value: 'st_teresa_school_gym', display: 'St. Teresa School Gym'},
  ];
  currentEventDocId: string;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private modalController: ModalController,
    private eventService: EventService,
    ) { }

  ngOnInit() {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      type: ['', Validators.required],
      location: ['', Validators.required],
      allDay: [''],
    });
    this.populateForm(this.event);
  }

  private populateForm(e) {
    if (!this.isSelectingDays) {
      const event = e.event;
      let full;
      let sTime;
      let startTime;
      let eTime;
      let endTime;
      // Switch from 24 hr format to format that the time picker will accept.
      sTime = event.start.toLocaleTimeString('en-US');
      startTime = moment(sTime, ['h:mm A']).format('hh:mm A');
      eTime = event.end.toLocaleTimeString('en-US');
      endTime = moment(eTime, ['h:mm A']).format('hh:mm A');
      console.log(`MD: EventPage -> populateForm -> event.end`, event.end);
      this.currentEventDocId = event.extendedProps.docId;
      full = {
        title: event.title,
        startDate: event.start,
        endDate: event.end,
        startTime,
        endTime,
        type: {value: event.extendedProps.type, bgColor: event.backgroundColor},
        location: event.extendedProps.location,
      };
      this.eventForm.patchValue(full);
    } else {
      const minusOneDay = moment(e.end).subtract(1, 'days').format('YYYY-MM-DD');
      const onlyDates = {
        startDate: e.start,
        endDate: minusOneDay + 'T06:00:00.000Z',
        // Must format endDate as: '2020-01-22T06:00:00.000Z',
      };
      this.eventForm.patchValue(onlyDates);
    }
  }

  get f() {
    return this.eventForm.controls;
  }

  submitHandler(formDirective) {
    const formValue = this.eventForm.value;
    const event: any = {
      title: formValue.title,
      start: this.formatDateTime(formValue.startDate, formValue.startTime),
      end:  this.formatDateTime(formValue.endDate, formValue.endTime),
      type: formValue.type.value,
      backgroundColor: formValue.type.bgColor,
      location: formValue.location,
      allDay: false,
    };

    if (!this.isSelectingDays) {
      this.firebaseService.eventsCollection.doc(this.currentEventDocId).update(event)
      .then(x => {
        this.resetForm();
      });
      // ToDo: If user is admin, allow event to be written to db, else it will simply be a request email.
    } else {
       this.firebaseService.eventsCollection.add(event)
        .then(x => {
          this.resetForm();
        });
    }
  }

  // https://stackoverflow.com/a/51121933
  // https://levelup.gitconnected.com/using-comparewith-in-angular-material-2-multiple-select-options-a6f44e565f90
  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.value === o2.value : o1 === o2;
  }

  formatDateTime(date: string, time) {
    const mTime = moment(time, ['h:mm A']).format('HH:mm');
    const fDate = moment(date).format('YYYY-MM-DD');
    const dateTime = moment(fDate + ' ' + mTime, 'YYYY/MM/DD HH:mm');
    const dtf = dateTime.format('YYYY-MM-DDTHH:mm');
    return dtf;
  }


  private resetForm(formDirective?) {
    if (formDirective) { formDirective.resetForm(); }
    this.eventForm.reset();
    this.dismiss();
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data.
    // https://ionicframework.com/docs/api/modal
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
