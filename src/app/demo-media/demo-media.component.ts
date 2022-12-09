import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ContentMediaComponent } from '../content-media/content-media.component';

import { DemoMetadataComponent } from '../demo-metadata/demo-metadata.component';
import { PercentPipe } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
    selector: 'app-demo-media',
    templateUrl: './demo-media.component.html',
    styleUrls: ['./demo-media.component.css']
})
export class DemoMediaComponent extends ContentMediaComponent implements AfterViewInit {

    // a reference to the canvas element from our template
    @ViewChild('canvas', { static: false })
    public canvas: ElementRef;
    private cx: CanvasRenderingContext2D;

    @Input()
    imageUrl: string;

    private _data: any;
    get data(): any {
        return this._data;
    }

    @Input('data')
    set data(value: any) {
        this._data = value;
        this.countPeople();
    }

    // setting a width and height for the canvas
    // @Input() public width = 400;
    // @Input() public height = 400;

    baseImage: any;

    scale: number = 0.5;


    nMales: number = 0;
    nFemales: number = 0;
    nTurned: number = 0;
    public facedetails: any[] = [];

    constructor() {
        super();
    }

    ngAfterViewInit() {
        // get the context
        const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
        this.cx = canvasEl.getContext('2d');

        // set the width and height
        canvasEl.width = 1920 * this.scale;
        canvasEl.height = 1280 * this.scale;

        // set some default properties about the line
        this.cx.lineWidth = 7;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = '#000';

        this.drawImage(this.imageUrl);
    }

    private countPeople(): void {
        let men: number = 0;
        let women: number = 0;
        let turned: number = 0;
        this.facedetails = this.data['Items'][0]['data']['FaceDetails'];
        this.facedetails.forEach((value: any) => {
            if (value['Pose']['Yaw'] > 45 || value['Pose']['Yaw'] < -45 ||
                value['Pose']['Pitch'] > 45 || value['Pose']['Pitch'] < -45) {
                ++turned;
            } else {
                const gender: any = value['Gender'];
                if (gender['Value'] === 'Male') {
                    ++men;
                } else {
                    ++women;
                }
            }
        });
        this.nMales = men;
        this.nFemales = women;
        this.nTurned = turned;
    }

    private drawImage(imageUrl: string) {
        const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
        if (!!this.data) {
            this.drawBoxes(this.data);
        }
        this.baseImage = new Image();
        this.baseImage.src = this.imageUrl;
        this.baseImage.onload = () => {
            this.cx.drawImage(this.baseImage, 0, 0, canvasEl.width, canvasEl.height);
            if (!!this.data) {
                this.drawBoxes(this.data);
            }
        };
    }

    private drawBoxes(data: any) {
        const facedetails: any[] = data['Items'][0]['data']['FaceDetails'];
        facedetails.forEach((value: any) => {
            const boundingBox: any = value['BoundingBox'];
            const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
            const x: number = boundingBox['Left'] * canvasEl.width;
            const y: number = boundingBox['Top'] * canvasEl.height;
            const w: number = boundingBox['Width'] * canvasEl.width;
            const h: number = boundingBox['Height'] * canvasEl.height;
            const box: any = { x: x, y: y, w: w, h: h };
            this.cx.lineWidth = 7;
            this.cx.lineCap = 'round';
            this.cx.strokeStyle = '#000';
            this.drawBoundingBox(boundingBox);
            this.cx.lineWidth = 3;
            this.cx.lineCap = 'round';
            this.cx.strokeStyle = '#FFF';
            this.drawBoundingBox(box);
        });
        this.cx.font = '16px Courier';
        facedetails.forEach((value: any) => {
            const confidence: number = value['Confidence'];
            const gender: any = value['Gender'];
            const ageRange: any = value['AgeRange'];
            const boundingBox: any = value['BoundingBox'];

            const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
            const x: number = boundingBox['Left'] * canvasEl.width;
            const y: number = boundingBox['Top'] * canvasEl.height;
            const w: number = boundingBox['Width'] * canvasEl.width;
            const h: number = boundingBox['Height'] * canvasEl.height;
            const box: any = { x: x, y: y, w: w, h: h };

            let label: string = this.formatConfidence(value);
            this.drawDataLabelOff(label, box, 11);

            label = this.formatAge(value);
            this.drawDataLabelOff(label, box, 10);

            label = this.formatGender(value);
            this.drawDataLabelOff(label, box, 9);

            label = this.formatBool(value, 'EyesOpen');
            this.drawDataLabelOff(label, box, 8);
            label = this.formatBool(value, 'Eyeglasses');
            this.drawDataLabelOff(label, box, 7);
            label = this.formatBool(value, 'Sunglasses');
            this.drawDataLabelOff(label, box, 6);
            label = this.formatBool(value, 'Mustache');
            this.drawDataLabelOff(label, box, 5);
            label = this.formatBool(value, 'Beard');
            this.drawDataLabelOff(label, box, 4);
            label = this.formatBool(value, 'MouthOpen');
            this.drawDataLabelOff(label, box, 3);
            label = this.formatBool(value, 'Smile');
            this.drawDataLabelOff(label, box, 2);
            label = this.formatSentiment(value);
            this.drawDataLabelOff(label, box, 1);
            label = this.formatPose(value);
            this.drawDataLabelOff(label, box, 0);

        });
    }

    private percent(n: number) {
        return n.toFixed(2).toString() + '%';
    }

    private formatConfidence(value: any): string {
        return 'Confidence: ' + this.percent(value['Confidence']);
    }
    private formatAge(value: any): string {
        const low: number = value['AgeRange']['Low'];
        const high: number = value['AgeRange']['High'];
        return 'Age: ' + low + '-' + high;
    }
    private formatGender(value: any): string {
        const gen: string = value['Gender']['Value'];
        const conf: number = value['Gender']['Confidence'];
        return gen + ' (' + this.percent(conf) + ')';
    }

    private formatBool(value: any, key: string) {
        const val: string = value[key]['Value'] ? 'Yes' : 'No';
        const conf: number = value[key]['Confidence'];
        return key + ': ' + val + ' (' + this.percent(conf) + ')';

    }

    private formatSentiment(value: any) {
        const emotions: any[] = value['Emotions'];
        const strs: string[] =
            emotions.sort((left: any, right: any) => right['Confidence'] - left['Confidence'])
                .filter((val) => val['Confidence'] > 10)
                .map((val) => val['Type'] + ' (' + this.percent(val['Confidence']) + ') ');
        return 'Sentiment: ' + strs.join(', ');
    }

    private formatDataString(ageRange: any, gender: any): string {
        const low: number = ageRange['Low'];
        const high: number = ageRange['High'];
        const gen: string = gender['Value'] === 'Male' ? 'M' : 'F';
        return '' + low + '-' + high + ' \n ' + gen;
    }

    private formatPose(value: any): string {
        const pose: any = value['Pose'];
        const roll: number = Math.round(pose['Roll']);
        const yaw: number = Math.round(pose['Yaw']);
        const pitch: number = Math.round(pose['Pitch']);
        return 'Roll: ' + roll + ' Yaw: ' + yaw + ' Pitch: ' + pitch;
    }

    private drawDataLabel(label: string, box: any) {
        this.cx.fillStyle = '#000';
        this.cx.fillText(label, box.x, box.y - 5);
        this.cx.stroke();
        this.cx.fillStyle = '#FFF';
        this.cx.fillText(label, box.x - 2, box.y - 5 - 2);
        this.cx.stroke();
    }

    private drawDataLabelOff(label: string, box: any, offset: number) {
        this.cx.fillStyle = '#000';
        this.cx.fillText(label, box.x, box.y - 5 - (offset * 18));
        this.cx.stroke();
        this.cx.fillStyle = '#ff0';
        this.cx.fillText(label, box.x - 1, box.y - 5 - 1 - (offset * 18));
        this.cx.stroke();
    }

    private drawBoundingBox(box: any) {
        this.cx.rect(box.x, box.y, box.w, box.h);
        this.cx.stroke();
    }

}
