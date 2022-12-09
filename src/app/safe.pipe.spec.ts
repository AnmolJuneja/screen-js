import { SafePipe } from './safe.pipe';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafePipe', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                SafePipe
            ],
            providers: [
                {
                    provide: DomSanitizer,
                    useValue: {
                        bypassSecurityTrustResourceUrl: (s: string) => 'safeString'
                    }
                }
            ]
        });
    });

    it('create an instance', () => {
        const sanitize = TestBed.get(DomSanitizer);
        const pipe = new SafePipe(sanitize);
        expect(pipe).toBeTruthy();
    });
});
