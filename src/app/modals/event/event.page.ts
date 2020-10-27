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
  showWarning: boolean;

  types = [
    {value: 'private_party', display: 'Private Party', bgColor: '#3dc6ab'},
    {value: 'sports', display: 'Sports Event', bgColor: '#ea6759'},
    {value: 'budget_meeting', display: 'Budget Meeting', bgColor: '#aa72c1'},
    {value: 'school_event', display: 'School Event', bgColor: '#f4ab36'},
  ];

  locations = [
    {value: 'main', display: 'Main Building'},
    {value: 'annex_east', display: 'Annex East'},
    {value: 'cafeteria', display: 'Cafeteria'},
    {value: 'school', display: 'School'},
    {value: 'gym', display: 'School Gym'},
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
      this.checkForEvents(this.arg);
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
      // The following props are for queries for dateIsAvailable().
      startStr: moment(formValue.startDate).format('YYYY-MM-DD'),
      sTime: formValue.startTime, // Do not use startTime else will populate every day.
      eTime: formValue.endTime,
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

  checkForEvents(arg) {
    // console.log(`MD: EventPage -> arg`, arg);
    // const selectionStartDate = arg.start.getDate();
    // console.log(`MD: EventPage -> selectionStartDate`, selectionStartDate);


    // Query events based on starting date of selected date range
    // If an event is scheduled on the same date on the same location,
    // the starting must be 30 min after the end of the last event.

    const eventsRef = this.firebaseService.eventsCollection.ref;
    const query = eventsRef.where('startStr', '==', arg.startStr)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(`Existing event: `, doc.data());
        });
      }).catch(error => {
        console.log('Error getting documents: ', error);
    });
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

  timeChanged() {
    setTimeout(() => {
      console.log(`MD: EventPage -> timeChanged -> this.eventForm.value`, this.eventForm.value);
    }, 250);
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
