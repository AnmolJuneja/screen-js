# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).


<a name="1.1.0"></a>
## [x.y.z](https://github.com/addulate/screen-js/releases/tag/v1.1.0) (2019-??-??)
### Added 
- Support for Widgets ([2af957](https://github.com/addulate/screen-js/commit/2af9579de773f9857a0c9db80ae8d05da6edae14))
- Added "playlist repeat" event which is relayed to JavaScript host. Used in Filinvest demo. ([535140a](https://github.com/addulate/screen-js/commit/535140af8bf72825650cb0387cfc8efc5d902eb4))
### Changed 
- Minor upgrades to 3rd party libraries
### Deprecated 
- for once-stable features removed in upcoming releases.
### Removed 
- for deprecated features removed in this release.
### Fixed 
- Fixes for how async video functions were handled.
- Fixes for unit tests that had broken
- 
### Security 
- to invite users to upgrade in case of vulnerabilities.



<a name="1.0.6"></a>
## [1.0.6](https://github.com/addulate/screen-js/releases/tag/v1.0.6) (2019-09-26)
### Emergency hotfix
- Added API guards to maintain compatability with older Android clients.

<a name="1.0.5"></a>
## [1.0.5](https://github.com/addulate/screen-js/releases/tag/v1.0.5) (2019-09-25)
### Added 
- Added "Playlist Repeat" analytics event whenever the playlist loops back to 0.
- Added `Android.onJsEvent()` call to notify host app about analytics events.
- Added `Android.updateOfflineMedia()` in anticipation of whitelisting offline storage
### Changed 
- `AndroidPlatformService` now implements `IAnalyticsVendor` 
- Upgrade 3rd party Libs
    - Angular 7.x -> Angular 8.x
    - see package.json for details
### Fixed
- url-media wouldn't hide as expected ([34703fe](https://github.com/addulate/screen-js/commit/34703feaedafe4973cd212a7fa4119a5e6a3bf7c))
- video-media improvements


<a name="1.0.4"></a>
## [1.0.4](https://github.com/addulate/screen-js/releases/tag/v1.0.4) (2019-06-19)
### Fixed
- TimeofDay calculations for periodic audience count

<a name="1.0.3"></a>
## [1.0.3](https://github.com/addulate/screen-js/releases/tag/v1.0.3) (2019-06-13)
### Added 
- Support for Web media type
- Support for triggering camera to take periodic pictures.
- Extended Screen type to have data for counting audiences
### Changed 
- Upgrade 3rd party Libs
    - Angular 6.x -> Angular 7.x
    - see package.json for details

<a name="1.0.2"></a>
## [1.0.2](https://github.com/addulate/screen-js/releases/tag/v1.0.2) (2019-01-17)
### Changed
- Pitch Demo: More metadata with each face.
- Pitch Demo: Excludes faces turned more than 45 degrees off-center

<a name="1.0.1"></a>
## [1.0.1](https://github.com/addulate/screen-js/releases/tag/v1.0.1) (2019-01-12)
### Added 
- Ability to do image capture without playing demo reel.
### Changed
- UI Improvement: VideoMedia now shows ThumbnailURL as poster
- UI improvements on DemoViewer
- Downscaled video in VideoMedia
### Fixed
- DemoMedia no longer double-counts male and female faces
- ExpressionChangedAfterItHasBeenCheckedError no longer triggered playing demo

<a name="1.0.0"></a>
## [1.0.0](https://github.com/addulate/screen-js/releases/tag/v1.0.0) (2018-11-06)
### Added 
- Demo Mode

<a name="1.0.0-beta.1"></a>
## [1.0.0-beta.1](https://github.com/addulate/screen-js/releases/tag/v1.0.0-beta.1) (2018-09-15)
### Added 
- Demo Mode

<a name="0.4.4"></a>
## [0.4.4](https://github.com/addulate/screen-js/releases/tag/v0.4.4) (2018-06-18)
### Added 
- Global error handler to capture uncaught exceptions.
### Fixed 
- Error that caused screens to go black and stop fetching new playlists [support-59]


<a name="0.4.3"></a>
## [0.4.3](https://github.com/addulate/screen-js/releases/tag/v0.4.3) (2018-05-26)
### Fixed 
- Improved Analytics [[support-55](https://github.com/addulate/support/issues/55)]

<a name="0.4.2"></a>
## [0.4.2](https://github.com/addulate/screen-js/releases/tag/v0.4.2) (2017-05-21)
### Changed 
- Analytics so production and staging go to separate accounts.
### Fixed 
- Analytics payload is being sent again (regression from move to HttpClient lib)
- Mixpanel client now reports send errors.

<a name="0.4.1"></a>
## [0.4.1](https://github.com/addulate/screen-js/releases/tag/v0.4.1) (2017-05-20)
### Added 
- Analytics Event for PlaylistItem pruning
### Changed
- Upgrades:
    - @angular/* 5.2.7 -> @angular/* 6.1.0
    - rxjs 5.5.10 -> rxjs 6.0
    - typescript 2.6.0 -> 2.7.2
### Fixed 
- issue where deleted media would show black screens
- Playlists now autostart when previewed [[support-34](https://github.com/addulate/support/issues/34)]

<a name="0.3.2"></a>
## [0.3.2](https://github.com/addulate/screen-js/releases/tag/v0.3.2) (2017-03-01)
### Changed 
- Upgrades 
  - @angular/* 5.0.2 -> @angular/* 5.2.7
  - angular-cli 1.5.3 -> @angular/cli-1.2.7
  - also moment, rrule, rxjs, videogular2, and others (see package.json diff for details)
### Fixed 
- Improved support for emulators
- Improved preview UI for playlists


<a name="0.3.1"></a>
## [0.3.1](https://github.com/addulate/screen-js/releases/tag/v0.3.1) (2017-12-30)
### Fixed 
- Multiple issues that surfaced with `--aot` compilation

<a name="0.3.0"></a>
## [0.3.0](https://github.com/addulate/screen-js/releases/tag/v0.3.0) (2017-12-29)
### Added 
- Scheduling
### Changed 
- Upgrades
  - @angular/* 2.3.1 -> @angular/* 5.0.2
  - angular-cli 1.0.0-beta -> @angular/cli-1.5.3

<a name="0.2.2"></a>
## [0.2.2](https://github.com/addulate/screen-js/releases/tag/v0.2.2) (2017-10-02)
### Added 
- Analytics (some features require API 0.2.3 or better)
- Startup Screen
- Loading Screen
- First custom-made typings (for clientjs)
### Changed 
- Underlying mechanism for how slides are advanced.

<a name="0.2.1"></a>
## [0.2.1](https://github.com/addulate/screen-js/releases/tag/v0.2.1) (2017-09-21)
### Initial release


<a name="x.y.z"></a>
## [x.y.z](https://github.com/addulate/screen-js/releases/tag/vx.y.z) (2019-??-??)
### Added 
- for new features.
### Changed 
- for changes in existing functionality.
### Deprecated 
- for once-stable features removed in upcoming releases.
### Removed 
- for deprecated features removed in this release.
### Fixed 
- for any bug fixes.
### Security 
- to invite users to upgrade in case of vulnerabilities.
