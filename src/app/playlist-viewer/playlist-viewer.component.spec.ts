import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistViewerComponent } from './playlist-viewer.component';

xdescribe('PlaylistViewerComponent', () => {
  let component: PlaylistViewerComponent;
  let fixture: ComponentFixture<PlaylistViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
