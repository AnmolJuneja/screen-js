import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { NGXLogger } from 'ngx-logger';
import { NGXLoggerMock } from 'ngx-logger/testing';
import { EventPriorityQueue } from './event-priority-queue';
import { IScreen } from '../models/screen.model';
import { IChannel } from '../models/channel.model';
import { IScheduledContent } from '../models/scheduled-content.model';
import { IPlaylist } from '../models/playlist.model';
import { IPlaylistItem } from '../models/playlistitem.model';
import { IImage } from '../models/image.model';
import { IVideo } from '../models/video.model';
import { IBroadcast } from '../models/broadcast.model';
import * as moment from 'moment-timezone';
import { RRule } from 'rrule';

const NYC_TZ = 'America/New_York';


const test_screen: IScreen = <IScreen>{
    'id': 'screen_8ca8700e-1ec9-4735-8515-2286eae4b1b7',
    'name': 'Creamery 1',
    'description': 'Front Entrance',
    'createdAt': '2017-11-26T21:08:15.000Z',
    'updatedAt': '2017-11-26T21:08:15.000Z',
    'channelId': 'channel_35099150-ce38-4434-aaf0-b49623ff1cc3',
    'locationId': 'location_7f3ee81f-7b73-46a9-a41d-61e787d17a5f',
    'accountId': 'account_21000000-0000-4000-b000-000000000000',
    'creatorId': 'user_11000000-0000-4000-b000-000000000000',
    'timezone': 'America/New_York'
};

const test_channel: IChannel = <IChannel>{
    'id': 'channel_35099150-ce38-4434-aaf0-b49623ff1cc3',
    'name': 'Creamery Main',
    'description': '',
    'createdAt': '2017-11-26T21:08:14.000Z',
    'updatedAt': '2017-11-29T22:47:19.000Z',
    'accountId': 'account_21000000-0000-4000-b000-000000000000',
    'creatorId': 'user_11000000-0000-4000-b000-000000000000',
    'defaultPlaylistId': 'playlist_791ad89c-7bd5-454f-a23d-2ab1ff6c5f9a'
};

const test_content: IScheduledContent[] = [
    <IScheduledContent>{
        'id': 'scheduledContent_4573a87a-dad2-4c7d-912b-9e897a0f6b45',
        'colorName': 'green',
        'startDatetime': '2017-11-28T03:00:00',
        'duration': 'PT2M',
        'repetitions': 1,
        'recurranceRule': 'DTSTART=20171128T030000Z;FREQ=DAILY;INTERVAL=1',
        'createdAt': '2017-11-30T06:06:14.000Z',
        'updatedAt': '2017-11-30T06:06:14.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'playlistId': 'playlist_e1e13a74-4e89-4a76-a49e-a4241efd8ba5',
        'channelId': 'channel_35099150-ce38-4434-aaf0-b49623ff1cc3'
    },
    <IScheduledContent>{
        'id': 'scheduledContent_469fded7-ebd8-4163-aa76-9bd6222ff9f6',
        'colorName': 'yellow',
        'startDatetime': '2017-11-29T02:00:00',
        'duration': 'PT2M',
        'repetitions': 1,
        'recurranceRule': '',
        'createdAt': '2017-11-29T22:47:42.000Z',
        'updatedAt': '2017-11-30T06:04:52.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'playlistId': 'playlist_e1e13a74-4e89-4a76-a49e-a4241efd8ba5',
        'channelId': 'channel_35099150-ce38-4434-aaf0-b49623ff1cc3'
    },
    <IScheduledContent>{
        'id': 'scheduledContent_d4d0162b-19b3-45a3-907d-2c7a46c4ceb7',
        'colorName': 'yellow',
        'startDatetime': '2017-11-29T01:00:00',
        'duration': 'PT1M5S',
        'repetitions': 1,
        'recurranceRule': '',
        'createdAt': '2017-11-29T22:47:34.000Z',
        'updatedAt': '2017-11-29T22:47:34.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'playlistId': 'playlist_36253b6e-5859-4682-8802-c509ef834a46',
        'channelId': 'channel_35099150-ce38-4434-aaf0-b49623ff1cc3'
    }
];

const test_playlists: IPlaylist[] = [
    {
        'id': 'playlist_36253b6e-5859-4682-8802-c509ef834a46',
        'title': 'Restaurant Program',
        'description': 'Food and Wine',
        'thumbnailUrl': null,
        'durationSecs': 65,
        'createdAt': '2017-11-26T21:08:15.000Z',
        'updatedAt': '2017-11-26T21:08:15.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'creatorId': null,
        'items': [
            {
                'id': 'playlistitem_6ebbdaa7-22de-4efc-9ed8-cfcc6782e993',
                'position': 0,
                'itemType': 'image',
                'itemId': 'image_a3ebf777-11f0-447e-9f40-b632083754cb',
                'startTime': 0,
                'durationSecs': 10,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_36253b6e-5859-4682-8802-c509ef834a46'
            },
            {
                'id': 'playlistitem_7cba9d49-2b1b-4c74-84ba-d73c4b00cc6f',
                'position': 1,
                'itemType': 'image',
                'itemId': 'image_fc56e493-dffb-4f21-8894-3e369f88db8c',
                'startTime': 0,
                'durationSecs': 30,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_36253b6e-5859-4682-8802-c509ef834a46'
            },
            {
                'id': 'playlistitem_e77c4495-3241-443c-af00-755be25962a1',
                'position': 2,
                'itemType': 'image',
                'itemId': 'image_a7760805-97cd-4b0c-a11c-dff7286fdc73',
                'startTime': 0,
                'durationSecs': 15,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_36253b6e-5859-4682-8802-c509ef834a46'
            },
            {
                'id': 'playlistitem_b095b0c4-aea6-498a-be84-0e5856c55d85',
                'position': 3,
                'itemType': 'image',
                'itemId': 'image_8f42bc68-b254-42eb-be35-ebf2c8592347',
                'startTime': 0,
                'durationSecs': 10,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_36253b6e-5859-4682-8802-c509ef834a46'
            }
        ]
    },
    {
        'id': 'playlist_791ad89c-7bd5-454f-a23d-2ab1ff6c5f9a',
        'title': 'Peter\'s Playlist',
        'description': null,
        'thumbnailUrl': null,
        'durationSecs': 143,
        'createdAt': '2017-11-26T21:08:15.000Z',
        'updatedAt': '2017-11-26T21:08:15.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'creatorId': null,
        'items': [
            {
                'id': 'playlistitem_6433dbe5-d680-49a7-bcfb-4164ff951056',
                'position': 0,
                'itemType': 'image',
                'itemId': 'image_a7760805-97cd-4b0c-a11c-dff7286fdc73',
                'startTime': 0,
                'durationSecs': 10,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_791ad89c-7bd5-454f-a23d-2ab1ff6c5f9a'
            },
            {
                'id': 'playlistitem_777b096c-136b-4d52-bfbf-069ae13ae106',
                'position': 1,
                'itemType': 'video',
                'itemId': 'video_06304f29-da65-4a42-a7e2-556668c18e90',
                'startTime': 0,
                'durationSecs': 25,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_791ad89c-7bd5-454f-a23d-2ab1ff6c5f9a'
            },
            {
                'id': 'playlistitem_8196a992-4512-4846-b35e-553c4095e426',
                'position': 2,
                'itemType': 'video',
                'itemId': 'video_3ea5e4b0-ff5a-4b48-8beb-b32ec8fcdbc3',
                'startTime': 0,
                'durationSecs': 25,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_791ad89c-7bd5-454f-a23d-2ab1ff6c5f9a'
            },
            {
                'id': 'playlistitem_8f08e084-024b-4b18-a115-b1f8a7597b4c',
                'position': 3,
                'itemType': 'image',
                'itemId': 'image_a3ebf777-11f0-447e-9f40-b632083754cb',
                'startTime': 0,
                'durationSecs': 30,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_791ad89c-7bd5-454f-a23d-2ab1ff6c5f9a'
            },
            {
                'id': 'playlistitem_965e97e7-01cb-4c5e-a430-42abd5c9ff5c',
                'position': 4,
                'itemType': 'image',
                'itemId': 'image_749bd0c8-4b09-4bdf-824d-b0ddbaf1d8e7',
                'startTime': 0,
                'durationSecs': 10,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_791ad89c-7bd5-454f-a23d-2ab1ff6c5f9a'
            },
            {
                'id': 'playlistitem_b547a72e-3e9b-4ac3-ade5-92c698984701',
                'position': 5,
                'itemType': 'image',
                'itemId': 'image_b9cbe754-6dbc-458d-b425-c1ddee06b6f8',
                'startTime': 0,
                'durationSecs': 0,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_791ad89c-7bd5-454f-a23d-2ab1ff6c5f9a'
            },
            {
                'id': 'playlistitem_cc8d7af2-abc5-4356-831e-c413a18c7d31',
                'position': 6,
                'itemType': 'image',
                'itemId': 'image_49feab9a-02c7-439e-9e25-afda6c754cec',
                'startTime': 0,
                'durationSecs': 43,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_791ad89c-7bd5-454f-a23d-2ab1ff6c5f9a'
            }
        ]
    },
    {
        'id': 'playlist_e1e13a74-4e89-4a76-a49e-a4241efd8ba5',
        'title': 'Mark\'s Playlist ',
        'description': 'Media Files with Ads',
        'thumbnailUrl': null,
        'durationSecs': 120,
        'createdAt': '2017-11-26T21:08:15.000Z',
        'updatedAt': '2017-11-26T21:08:15.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'creatorId': null,
        'items': [
            {
                'id': 'playlistitem_1f333bef-6c87-4f68-83e6-ec37e57cb01f',
                'position': 0,
                'itemType': 'image',
                'itemId': 'image_b9cbe754-6dbc-458d-b425-c1ddee06b6f8',
                'startTime': 0,
                'durationSecs': 10,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_e1e13a74-4e89-4a76-a49e-a4241efd8ba5'
            },
            {
                'id': 'playlistitem_23ab7368-4ce9-4351-9092-0f18f96ccf47',
                'position': 1,
                'itemType': 'video',
                'itemId': 'video_06304f29-da65-4a42-a7e2-556668c18e90',
                'startTime': 0,
                'durationSecs': 30,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_e1e13a74-4e89-4a76-a49e-a4241efd8ba5'
            },
            {
                'id': 'playlistitem_60740049-4d30-4c75-bf29-3ac0be9a0d2e',
                'position': 2,
                'itemType': 'video',
                'itemId': 'video_f2fc56b9-a204-4241-91fe-654ffeadcce9',
                'startTime': 0,
                'durationSecs': 30,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_e1e13a74-4e89-4a76-a49e-a4241efd8ba5'
            },
            {
                'id': 'playlistitem_626416e8-f596-48b2-a511-524d0c278932',
                'position': 3,
                'itemType': 'image',
                'itemId': 'image_e3da82d0-edd7-4bf6-86d5-4ec2b83fa382',
                'startTime': 0,
                'durationSecs': 10,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_e1e13a74-4e89-4a76-a49e-a4241efd8ba5'
            },
            {
                'id': 'playlistitem_72567900-d832-4599-8370-7ff01865d32c',
                'position': 4,
                'itemType': 'image',
                'itemId': 'image_fc56e493-dffb-4f21-8894-3e369f88db8c',
                'startTime': 0,
                'durationSecs': 10,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_e1e13a74-4e89-4a76-a49e-a4241efd8ba5'
            },
            {
                'id': 'playlistitem_8d0536ed-b0e9-40b4-916e-13f2fa3221d0',
                'position': 5,
                'itemType': 'image',
                'itemId': 'image_46ed939b-8fa1-47ff-b40d-ce9f4631f38d',
                'startTime': 0,
                'durationSecs': 10,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_e1e13a74-4e89-4a76-a49e-a4241efd8ba5'
            },
            {
                'id': 'playlistitem_b2e317f6-12ea-4993-8865-28f6e42170e6',
                'position': 6,
                'itemType': 'image',
                'itemId': 'image_8833614e-f63d-4a5b-8045-05d8a8f3cd15',
                'startTime': 0,
                'durationSecs': 10,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_e1e13a74-4e89-4a76-a49e-a4241efd8ba5'
            },
            {
                'id': 'playlistitem_fcba7ad3-e340-4feb-9b5f-1807551e0253',
                'position': 7,
                'itemType': 'image',
                'itemId': 'image_49feab9a-02c7-439e-9e25-afda6c754cec',
                'startTime': 0,
                'durationSecs': 10,
                'createdAt': '2017-11-26T21:08:15.000Z',
                'updatedAt': '2017-11-26T21:08:15.000Z',
                'playlistId': 'playlist_e1e13a74-4e89-4a76-a49e-a4241efd8ba5'
            }
        ]
    }
];

const test_images: IImage[] = [
    {
        'id': 'image_46ed939b-8fa1-47ff-b40d-ce9f4631f38d',
        'title': 'Subway Ad',
        'description': null,
        'thumbnailUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/c1920x1080_40.jpg',
        'imageUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/c1920x1080_40.jpg',
        'mimeType': 'image/jpeg',
        'width': 1920,
        'height': 1080,
        'fileSizeBytes': 107403,
        'createdAt': '2017-11-26T21:08:14.000Z',
        'updatedAt': '2017-11-26T21:08:14.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'creatorId': null
    },
    {
        'id': 'image_49feab9a-02c7-439e-9e25-afda6c754cec',
        'title': 'Game of Thrones ',
        'description': null,
        'thumbnailUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/game_of_thrones_game_cyanide_studio_action_role_playing_game_100754_1920x1080.jpg',
        'imageUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/game_of_thrones_game_cyanide_studio_action_role_playing_game_100754_1920x1080.jpg',
        'mimeType': 'image/jpeg',
        'width': 1920,
        'height': 1080,
        'fileSizeBytes': 671869,
        'createdAt': '2017-11-26T21:08:14.000Z',
        'updatedAt': '2017-11-26T21:08:14.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'creatorId': null
    },
    {
        'id': 'image_749bd0c8-4b09-4bdf-824d-b0ddbaf1d8e7',
        'title': 'Addidas',
        'description': 'Ad',
        'thumbnailUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/Addidas.jpg',
        'imageUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/Addidas.jpg',
        'mimeType': 'image/jpeg',
        'width': 1920,
        'height': 1080,
        'fileSizeBytes': 109579,
        'createdAt': '2017-11-26T21:08:14.000Z',
        'updatedAt': '2017-11-26T21:08:14.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'creatorId': null
    },
    {
        'id': 'image_8833614e-f63d-4a5b-8045-05d8a8f3cd15',
        'title': 'Guinness Beer',
        'description': null,
        'thumbnailUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/434738.jpg',
        'imageUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/434738.jpg',
        'mimeType': 'image/jpeg',
        'width': 3508,
        'height': 2480,
        'fileSizeBytes': 2324995,
        'createdAt': '2017-11-26T21:08:14.000Z',
        'updatedAt': '2017-11-26T21:08:14.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'creatorId': null
    },
    {
        'id': 'image_8f42bc68-b254-42eb-be35-ebf2c8592347',
        'title': 'Sushi Dinner',
        'description': null,
        'thumbnailUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/sushiad.jpg',
        'imageUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/sushiad.jpg',
        'mimeType': 'image/jpeg',
        'width': 1920,
        'height': 0,
        'fileSizeBytes': 233908,
        'createdAt': '2017-11-26T21:08:14.000Z',
        'updatedAt': '2017-11-26T21:08:14.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'creatorId': null
    },
    {
        'id': 'image_a3ebf777-11f0-447e-9f40-b632083754cb',
        'title': 'Wine and Steak',
        'description': 'Candlelight',
        'thumbnailUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/romantic%20resturant.jpg',
        'imageUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/romantic%20resturant.jpg',
        'mimeType': 'image/jpeg',
        'width': 1920,
        'height': 0,
        'fileSizeBytes': 725592,
        'createdAt': '2017-11-26T21:08:14.000Z',
        'updatedAt': '2017-11-26T21:08:14.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'creatorId': null
    },
    {
        'id': 'image_a7760805-97cd-4b0c-a11c-dff7286fdc73',
        'title': 'Shrimp',
        'description': 'Amaya',
        'thumbnailUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/amaya-1920x1080.jpg',
        'imageUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/amaya-1920x1080.jpg',
        'mimeType': 'image/jpeg',
        'width': 1920,
        'height': 0,
        'fileSizeBytes': 635302,
        'createdAt': '2017-11-26T21:08:14.000Z',
        'updatedAt': '2017-11-26T21:08:14.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'creatorId': null
    },
    {
        'id': 'image_b9cbe754-6dbc-458d-b425-c1ddee06b6f8',
        'title': 'Watch-Advertisement',
        'description': null,
        'thumbnailUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/background-black-heuer-watches-advertisement-carrera-pictures-wallpapers-images.jpg',
        'imageUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/background-black-heuer-watches-advertisement-carrera-pictures-wallpapers-images.jpg',
        'mimeType': 'image/jpeg',
        'width': 1920,
        'height': 1080,
        'fileSizeBytes': 157696,
        'createdAt': '2017-11-26T21:08:14.000Z',
        'updatedAt': '2017-11-26T21:08:14.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'creatorId': null
    },
    {
        'id': 'image_e3da82d0-edd7-4bf6-86d5-4ec2b83fa382',
        'title': 'Coca Cola advertisement ',
        'description': 'Advertisement',
        'thumbnailUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/Coca%2BCola.jpg',
        'imageUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/Coca%2BCola.jpg',
        'mimeType': 'image/jpeg',
        'width': 5048,
        'height': 2567,
        'fileSizeBytes': 1966444,
        'createdAt': '2017-11-26T21:08:14.000Z',
        'updatedAt': '2017-11-26T21:08:14.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'creatorId': null
    },
    {
        'id': 'image_fc56e493-dffb-4f21-8894-3e369f88db8c',
        'title': 'Pepsi Cola ',
        'description': null,
        'thumbnailUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/pepsi-2.jpg',
        'imageUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/pepsi-2.jpg',
        'mimeType': 'image/jpeg',
        'width': 1920,
        'height': 1080,
        'fileSizeBytes': 249444,
        'createdAt': '2017-11-26T21:08:14.000Z',
        'updatedAt': '2017-11-26T21:08:14.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'creatorId': null
    }
];

const test_videos: IVideo[] = [
    {
        'id': 'video_06304f29-da65-4a42-a7e2-556668c18e90',
        'title': 'Chumbawamba',
        'description': 'Music Video',
        'thumbnailUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/Tubthumping.png',
        'contentUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/Chumbawamba+-+Tubthumping.mp4',
        'mimeType': 'video/mp4',
        'width': 640,
        'height': 360,
        'fileSizeBytes': 19319856,
        'durationSecs': 221.308,
        'createdAt': '2017-11-26T21:08:15.000Z',
        'updatedAt': '2017-11-26T21:08:15.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'creatorId': null
    },
    {
        'id': 'video_3ea5e4b0-ff5a-4b48-8beb-b32ec8fcdbc3',
        'title': 'Like a Stone - Audio Slave',
        'description': 'Music video',
        'thumbnailUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/maxresdefault.jpg',
        'contentUrl': 'https://s3-us-west-2.amazonaws.com/media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/user_00000000-0000-4000-b000-000000000000/Audioslave+-+Like+a+Stone+%28Official+Video%29.mp4',
        'mimeType': 'video/mp4',
        'width': 640,
        'height': 360,
        'fileSizeBytes': 15746849,
        'durationSecs': 299.653,
        'createdAt': '2017-11-26T21:08:15.000Z',
        'updatedAt': '2017-11-26T21:08:15.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'creatorId': null
    },
    {
        'id': 'video_f2fc56b9-a204-4241-91fe-654ffeadcce9',
        'title': 'Elephant\'s Dream',
        'description': 'Orange Open Movie Project Studio',
        'thumbnailUrl': 'https://archive.org/services/img/ElephantsDream',
        'contentUrl': 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4',
        'mimeType': 'video/mp4',
        'width': 426,
        'height': 240,
        'fileSizeBytes': 5256,
        'durationSecs': 653.792,
        'createdAt': '2017-11-26T21:08:15.000Z',
        'updatedAt': '2017-11-26T21:08:15.000Z',
        'accountId': 'account_21000000-0000-4000-b000-000000000000',
        'creatorId': 'user_11000000-0000-4000-b000-000000000000'
    }
];


const broadcast_json: IBroadcast = <IBroadcast>{
    'screen': test_screen,
    'channel': test_channel,
    'scheduledContent': test_content,
    'playlists': test_playlists,
    'images': test_images,
    'videos': test_videos,
    'ip': '::1',
    'ips': []
};

const tz: string = broadcast_json.screen.timezone;


describe('EventPriorityQueue', () => {

    let logger: NGXLogger;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                LoggerTestingModule
            ],
            providers: [
                { provide: NGXLogger, useClass: NGXLoggerMock },
            ],
        });
    });

    beforeEach(() => {
        logger = TestBed.get(NGXLogger);
    });

    it('can be instantiated', () => {
        // when
        const q: EventPriorityQueue = new EventPriorityQueue(null, null, null, null, logger);
        // assert
        expect(q).toBeTruthy();
        expect(q.broadcast).toBeFalsy();
        expect(q.rangeStart).toBeFalsy();
        expect(q.rangeEnd).toBeFalsy();
        expect(q.showtimes).toEqual([]);
    });

    it('can be initialized', () => {
        // when
        const q: EventPriorityQueue = new EventPriorityQueue(broadcast_json,
            moment.tz('20171129', NYC_TZ), moment.tz('20171130', NYC_TZ), NYC_TZ, logger);
        // assert
        expect(q).toBeTruthy();
        expect(q.broadcast).toBeTruthy();
        expect(q.rangeStart.format()).toEqual('2017-11-29T00:00:00-05:00');
        expect(q.rangeEnd.format()).toEqual('2017-11-30T00:00:00-05:00');
        expect(q.showtimes.length).toBe(8);
    });

    it('can pick appropriate things to play', () => {
        // when
        const q: EventPriorityQueue = new EventPriorityQueue(broadcast_json,
            moment.tz('20171129', NYC_TZ), moment.tz('20171130', NYC_TZ), NYC_TZ, logger);
        // assert
        expect(q.check(moment.tz('2017-11-29T00:59:00', NYC_TZ)).now.scheduledContent.id).toEqual('scheduledContent_default');
        expect(q.check(moment.tz('2017-11-29T01:00:00', NYC_TZ)).now.scheduledContent.id).toEqual('scheduledContent_d4d0162b-19b3-45a3-907d-2c7a46c4ceb7');
        expect(q.check(moment.tz('2017-11-29T01:30:00', NYC_TZ)).now.scheduledContent.id).toEqual('scheduledContent_default');
        expect(q.check(moment.tz('2017-11-29T01:59:59', NYC_TZ)).now.scheduledContent.id).toEqual('scheduledContent_default');
        expect(q.check(moment.tz('2017-11-29T02:00:00', NYC_TZ)).now.scheduledContent.id).toEqual('scheduledContent_469fded7-ebd8-4163-aa76-9bd6222ff9f6');
        expect(q.check(moment.tz('2017-11-29T02:00:01', NYC_TZ)).now.scheduledContent.id).toEqual('scheduledContent_469fded7-ebd8-4163-aa76-9bd6222ff9f6');
        expect(q.check(moment.tz('2017-11-29T02:30:00', NYC_TZ)).now.scheduledContent.id).toEqual('scheduledContent_default');
        expect(q.check(moment.tz('2017-11-29T03:00:00', NYC_TZ)).now.scheduledContent.id).toEqual('scheduledContent_4573a87a-dad2-4c7d-912b-9e897a0f6b45');
        expect(q.check(moment.tz('2017-11-29T04:00:00', NYC_TZ)).now.scheduledContent.id).toEqual('scheduledContent_default');

    });

    it('can forecast the next thing to play', () => {
        // when
        const q: EventPriorityQueue = new EventPriorityQueue(broadcast_json,
            moment.tz('20171129', NYC_TZ), moment.tz('20171130', NYC_TZ), NYC_TZ, logger);
        // assert
        expect(q.check(moment.tz('2017-11-29T00:59:00', NYC_TZ)).next.scheduledContent.id).toEqual('scheduledContent_d4d0162b-19b3-45a3-907d-2c7a46c4ceb7');
        expect(q.check(moment.tz('2017-11-29T01:00:00', NYC_TZ)).next.scheduledContent.id).toEqual('scheduledContent_default');
        expect(q.check(moment.tz('2017-11-29T01:30:00', NYC_TZ)).next.scheduledContent.id).toEqual('scheduledContent_469fded7-ebd8-4163-aa76-9bd6222ff9f6');
        expect(q.check(moment.tz('2017-11-29T01:59:59', NYC_TZ)).next.scheduledContent.id).toEqual('scheduledContent_469fded7-ebd8-4163-aa76-9bd6222ff9f6');
        expect(q.check(moment.tz('2017-11-29T02:00:00', NYC_TZ)).next.scheduledContent.id).toEqual('scheduledContent_default');
        expect(q.check(moment.tz('2017-11-29T02:00:01', NYC_TZ)).next.scheduledContent.id).toEqual('scheduledContent_default');
        expect(q.check(moment.tz('2017-11-29T02:30:00', NYC_TZ)).next.scheduledContent.id).toEqual('scheduledContent_4573a87a-dad2-4c7d-912b-9e897a0f6b45');
        expect(q.check(moment.tz('2017-11-29T03:00:00', NYC_TZ)).next.scheduledContent.id).toEqual('scheduledContent_default');
    });

    describe('white-box tests', () => {

        it('can remap recurrance rules', () => {
            const rrule: RRule = RRule.fromString('DTSTART=20171129T110000Z;FREQ=DAILY;INTERVAL=1');
            expect(rrule).toBeTruthy();
        });
    });

});

broadcast_json.playlists.forEach((playlist: IPlaylist) => {
    playlist.items.forEach((item: IPlaylistItem) => {
        if (item.itemType === 'video') {
            item['item'] = broadcast_json.videos.find(value => value.id === item.itemId);
        } else if (item.itemType === 'image') {
            item['item'] = broadcast_json.images.find(value => value.id === item.itemId);
        }
    });
});

broadcast_json.scheduledContent.forEach((scheduledContent: IScheduledContent) => {
    scheduledContent['playlist'] = broadcast_json.playlists.find(value => value.id === scheduledContent.playlistId);
    if (!!scheduledContent.recurranceRule) {
        const newRule: string = scheduledContent.recurranceRule.replace(/(\d{8}T\d{6})Z/g, (whole: string, datetimeOnly: string): string => {
            return moment.tz(datetimeOnly, tz).utc().format('YYYYMMDD[T]HHmmSS[Z]');
        });
        scheduledContent.recurranceRule = newRule;
    }
});
