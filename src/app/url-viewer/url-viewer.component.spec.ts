import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlViewerComponent } from './url-viewer.component';
import { UrlMediaComponent } from '../url-media/url-media.component';
import { SafePipe } from '../safe.pipe';

xdescribe('UrlViewerComponent', () => {
    let component: UrlViewerComponent;
    let fixture: ComponentFixture<UrlViewerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                UrlViewerComponent,
                UrlMediaComponent,
                SafePipe
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UrlViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
