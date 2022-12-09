import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastViewerComponent } from './broadcast-viewer.component';

xdescribe('BroadcastViewerComponent', () => {
  let component: BroadcastViewerComponent;
  let fixture: ComponentFixture<BroadcastViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadcastViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
