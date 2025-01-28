import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermoComponent } from './termo.component';

describe('TermoComponent', () => {
  let component: TermoComponent;
  let fixture: ComponentFixture<TermoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
