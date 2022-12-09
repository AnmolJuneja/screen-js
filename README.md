# ScreenJs

The platform-independent part of Addulate's signage software that runs everywhere there's a browser engine. The primary engine used for development is [Blink](https://www.chromium.org/blink). Android's WebView component was based on Blink instead of WebKit since Android 4.4. 


This project was initially generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.3 and evolved through at least version 6.0.0

## 1. Command Line
### 1.A. Development server

Run `ng serve -c local` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### 1.B. Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### 1.C. Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

###1.D. Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## 2. Paths

### 2.A.  General endpoints
 * `#/broadcast/{screen_id}`  Default view (screens and console)
 * `#/playlists/{id}` Preview mode for a specific playlist (console only)
 * `#/videos/{id}` Preview mode for a specific video (console only)
 * `#/images/{id}` Preview mode for a specific image (console.only)
 * `**` Splash screen

### 2.B. Query Parameters

* Screen Only
    * `/?i={unique_id}` **id** - random unique id for analytics tracking 
    * `/?adid={unique_id}` **advertising id** (deprecated, use /?i={})
* Console Only
    * `/?a={account_xyz}` **acting account** - acting account for preview (console only)
    * `/?t={token}` **token** - access token for preview (console only)
* Developer Only
    * `/?e=1` **emulator** - changes the REST API's endpoint to [http://10.0.2.2:3000](http://10.0.2.2:3000) which loops the android emulator back to localhost
    * `/?v=1` **verbosity** - turns on extra verbosity

## 3. Design

### 3.A. Media, Viewer, & Loader

Most media types (e.g. images, videos, playlists, broadcasts, etc) have the same pattern of Media, Viewer, and Loader. And they all inherit from `ContentMediaComponent`, and `ContentViewerComponent`, and `ContentLoaderComponent`, respectively.  
* All media types can `show()`, `hide()`, `play()`, `pause()`, and animate in and out.
* All viewer types provide higher-level interactions with a media type. They often manage UI, debugging info, passage of time
* All Loaders handle routes.  So there's only one Loader per page, and it typically has a matching viewer, but all kinds of ContentMediaComponents can flow from there.

### 3.B. Engine

A big part of the `BroadcastViewerComponent` is the `BroadcastEngine`.    The `BroadcastEngine` uses an `EventPriorityQueue` which is a specialization of `PriorityQueue`. The algorithm computes all the events for the next 24 hours based on all the scheduled items (including repeating items) and puts them into the queue... then the `BroadcastEngine` prioritizes and always displays the current and next scheduled events of highest priority.