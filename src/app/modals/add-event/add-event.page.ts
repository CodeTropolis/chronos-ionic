import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {

  eventForm: FormGroup;

  eventTypes = [
    {value: 'private_party', viewValue: 'Private Party', bgColor: '#3dc6ab'},
    {value: 'sports', viewValue: 'Sports', bgColor: '#ea6759'},
    {value: 'st_luke', viewValue: 'St. Luke', bgColor: '#aa72c1'},
    {value: 'st_teresa_parish', viewValue: 'St. Teresa Parish', bgColor: '#53a7e0'},
    {value: 'school_event', viewValue: 'St. Teresa School Event', bgColor: '#f4ab36'},
  ];

  locations = [
    {value: 'st_luke_church', viewValue: 'St. Luke Church'},
    {value: 'st_luke_community_house', viewValue: 'St. Luke Community House'},
    {value: 'st_luke_parish_center', viewValue: 'St. Luke Parish Center'},
    {value: 'st_luke_room', viewValue: 'St. Luke Room'},
    {value: 'st_teresa_church', viewValue: 'St. Teresa Church'},
    {value: 'st_teresa_cafeteria', viewValue: 'St. Teresa Cafeteria'},
    {value: 'st_teresa_parish_center', viewValue: 'St. Teresa Parish Center'},
    {value: 'st_teresa_rectory', viewValue: 'St. Teresa Rectory'},
    {value: 'st_teresa_school', viewValue: 'St. Teresa School'},
    {value: 'st_teresa_school_gym', viewValue: 'St. Teresa School Gym'},
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

    // convenience getter for easy access to form fields
  get f() {
    return this.eventForm.controls;
  }

}
