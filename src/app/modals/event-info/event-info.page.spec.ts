import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventInfoPage } from './event-info.page';

describe('EventInfoPage', () => {
  let component: EventInfoPage;
  let fixture: ComponentFixture<EventInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EventInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
