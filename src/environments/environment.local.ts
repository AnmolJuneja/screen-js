import { VersionInfo } from './versioninfo';

export const environment = {
    production: false,
    // endpoint: 'http://localhost:3000',
    endpoint: 'http://0.0.0.0:4900',
    androidEndpoint: 'http://10.0.2.2:3000',
    widgetEndpoint: 'https://localhost:3000',
    apiGateway: 'https://api2.addulate.com',
    // apiGateway: 'http:0.0.0.0:4900',
    mixpanel_token: '9bd7f4df0bfc9efb3e928b45f1f15b4e',
    releaseInfo: VersionInfo
};
