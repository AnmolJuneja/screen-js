import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlLoaderComponent } from './url-loader.component';
import { UrlViewerComponent } from '../url-viewer/url-viewer.component';
import { UrlMediaComponent } from '../url-media/url-media.component';
import { SafePipe } from '../safe.pipe';

xdescribe('UrlLoaderComponent', () => {
    let component: UrlLoaderComponent;
    let fixture: ComponentFixture<UrlLoaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                UrlLoaderComponent,
                UrlViewerComponent,
                UrlMediaComponent,
                SafePipe
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UrlLoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
