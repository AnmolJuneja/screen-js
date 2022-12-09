import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistLoaderComponent } from './playlist-loader.component';

xdescribe('PlaylistLoaderComponent', () => {
  let component: PlaylistLoaderComponent;
  let fixture: ComponentFixture<PlaylistLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
