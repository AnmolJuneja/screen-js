// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
import { VersionInfo } from './versioninfo';

export const environment = {
    production: false,
    endpoint: 'https://api.prod.addulate.com',
    androidEndpoint: 'https://api.stage.addulate.com',
    widgetEndpoint: 'https://widgets.stage.addulate.com',
    mixpanel_token: '123abc-prod',
    releaseInfo: VersionInfo
};
