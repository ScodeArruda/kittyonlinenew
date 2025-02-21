import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataGoogleComponent } from './data-google.component';

describe('DataGoogleComponent', () => {
  let component: DataGoogleComponent;
  let fixture: ComponentFixture<DataGoogleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGoogleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
