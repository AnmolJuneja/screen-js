import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageMediaComponent } from './image-media.component';

xdescribe('ImageMediaComponent', () => {
  let component: ImageMediaComponent;
  let fixture: ComponentFixture<ImageMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
