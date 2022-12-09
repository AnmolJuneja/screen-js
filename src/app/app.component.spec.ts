/* tslint:disable:no-unused-variable */
import { } from 'jasmine';

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { AppRoutes } from 'app/app.routes';
// import { BroadcastComponent } from 'app/broadcast/broadcast.component';
import { SplashComponent } from 'app/splash/splash.component';

xdescribe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                // BroadcastComponent,
                SplashComponent
            ],
            imports: [
                AppRouting
            ]
        });
        TestBed.compileComponents();
    });

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it(`should have as title 'app works!'`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('app works!');
    }));

    it('should render title in a h1 tag', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('app works!');
    }));
});
