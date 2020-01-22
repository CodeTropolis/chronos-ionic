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

  @Input() arg: any;
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
    this.populateForm(this.arg);
  }

  private populateForm(arg) {
    this.dateIsAvailable(this.arg);
    if (!this.isSelectingDays) {
      const event = arg.event;
      // Switch from 24 hr format to format that the time picker will accept.
      const sTime = event.start.toLocaleTimeString('en-US');
      const startTime = moment(sTime, ['h:mm A']).format('hh:mm A');
      const eTime = event.end.toLocaleTimeString('en-US');
      const endTime = moment(eTime, ['h:mm A']).format('hh:mm A');
      this.currentEventDocId = event.extendedProps.docId;
      const full = {
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
      const minusOneDay = moment(arg.end).subtract(1, 'days').format('YYYY-MM-DDT06:00:00.000Z');
      const onlyDates = {
        startDate: arg.start,
        endDate: minusOneDay,
        // Must format endDate as: 'YYYY-MM-DDT00:00:00.000Z' (use arbitrary hour) in order for end date field to populate.
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
      startStr: moment(formValue.startDate).format('YYYY-MM-DD') // For Queries
    };
    // If an event is clicked, the event handler from home.page will pass in isSelectingDays as false
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

  dateIsAvailable(arg): boolean {
    // console.log(`MD: EventPage -> arg`, arg);
    // Query events based on starting date of selected date range
    // If an event is scheduled on the same date on the same location,
    // the starting must be 30 min after the end of the last event.

    // const eventsRef = this.firebaseService.eventsCollection.ref;
    // const query = eventsRef.where('startStr', '==', arg.startStr)
    //   .get()
    //   .then(querySnapshot => {
    //     querySnapshot.forEach(doc => {
    //       console.log(doc.data());
    //     });
    //   }).catch(error => {
    //     console.log('Error getting documents: ', error);
    // });
    return true;
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
