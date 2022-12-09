import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'elapsedTime',
})
export class ElapsedTimePipe implements PipeTransform {

    transform(totalSeconds: number, args?: any): string {
        if (isNaN(totalSeconds)) {
            return undefined;
        }
        totalSeconds /= 1000;
        const negativeSign: string = (totalSeconds < 0) ? '-' : '';
        totalSeconds = Math.abs(totalSeconds);
        const hours: number = Math.floor(totalSeconds / 3600);
        const remainingSeconds: number = totalSeconds % 3600;
        const minutes: number = Math.floor(remainingSeconds / 60);
        const seconds: number = Math.floor(remainingSeconds % 60);

        const strHours: string = '' + (hours === 0 ? '' : hours + ':');  // "" or "07:"
        const strMinutes: string = '' + (minutes < 10 ? '0' : '') + minutes + ':'; // "00:" -> "59:"
        const strSeconds: string = '' + (seconds < 10 ? '0' : '') + seconds; // "00" -> "59"

        return negativeSign + strHours + strMinutes + strSeconds;
    }
}
