import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoMediaComponent } from './demo-media.component';

describe('DemoMediaComponent', () => {
  let component: DemoMediaComponent;
  let fixture: ComponentFixture<DemoMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
