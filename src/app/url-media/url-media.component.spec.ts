import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SafePipe } from '../safe.pipe';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { UrlMediaComponent } from './url-media.component';
import { UrlViewerComponent } from '../url-viewer/url-viewer.component';

xdescribe('UrlMediaComponent', () => {
    let component: UrlMediaComponent;
    let fixture: ComponentFixture<UrlMediaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                UrlMediaComponent,
                UrlViewerComponent,
                SafePipe,
            ],
            imports: [TranslateModule],
            providers: [
                TranslateService,
                TranslateStore
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UrlMediaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
