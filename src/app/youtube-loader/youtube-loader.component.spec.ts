import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeLoaderComponent } from './youtube-loader.component';

xdescribe('YoutubeLoaderComponent', () => {
    let component: YoutubeLoaderComponent;
    let fixture: ComponentFixture<YoutubeLoaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [YoutubeLoaderComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(YoutubeLoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
