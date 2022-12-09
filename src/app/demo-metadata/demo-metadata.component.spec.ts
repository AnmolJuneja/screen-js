import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoMetadataComponent } from './demo-metadata.component';

describe('DemoMetadataComponent', () => {
  let component: DemoMetadataComponent;
  let fixture: ComponentFixture<DemoMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
