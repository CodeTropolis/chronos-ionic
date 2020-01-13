import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'add-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  // selected =  {value: 'private_party', display: 'Private Party', bgColor: '#3dc6ab'};

  @Input() event: any;
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

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService, private modalController: ModalController) { }

  ngOnInit() {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['', Validators.required],
      location: ['', Validators.required],
    });

    // If user is admin
    this.populateForm(this.event);
  }

  private populateForm(e) {
    console.log(`MD: EventPage -> populateForm -> e`, e);
    this.eventForm.patchValue({
      title: e.title,
      startDate: e.start,
      endDate: e.end,
      type: {value: e.extendedProps.type, bgColor: e.backgroundColor},
      location: e.extendedProps.location,
    });
    console.log(`MD: EventPage -> populateForm -> this.eventForm`, this.eventForm);
  }

  get f() {
    return this.eventForm.controls;
  }

  submitHandler(formDirective) {
    const formValue = this.eventForm.value;
    const event: any = {
      title: formValue.title,
      start: this.formatDate(formValue.startDate),
      end:  this.formatDate(formValue.endDate),
      type: formValue.type.value,
      backgroundColor: formValue.type.bgColor,
      location: formValue.location
    };

    this.firebaseService.eventsCollection.add(event)
      .then(x => {
        this.resetForm();
      });
  }

  // https://stackoverflow.com/a/51121933
  // https://levelup.gitconnected.com/using-comparewith-in-angular-material-2-multiple-select-options-a6f44e565f90
  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.value === o2.value : o1 === o2;
  }

  formatDate(date: string) {
    return moment(date).format('YYYY-MM-DD');
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