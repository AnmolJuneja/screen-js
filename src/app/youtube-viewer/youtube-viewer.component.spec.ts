import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeViewerComponent } from './youtube-viewer.component';

xdescribe('YoutubeViewerComponent', () => {
    let component: YoutubeViewerComponent;
    let fixture: ComponentFixture<YoutubeViewerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [YoutubeViewerComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(YoutubeViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
