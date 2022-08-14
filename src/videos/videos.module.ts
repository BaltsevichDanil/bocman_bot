import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FavouriteEntity } from '../favourite/entities/favourite.entity'
import { FavouriteModule } from '../favourite/favourite.module'
import { SuspectsModule } from '../suspects/suspects.module'

import { VideoEntity } from './entities/video.entity'
import { FindVideoScene } from './scenes/find-video.scene'
import { ShowVideosScene } from './scenes/show-videos.scene'
import { UploadVideoScene } from './scenes/upload-video.scene'
import { VideosService } from './videos.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([VideoEntity, FavouriteEntity]),
        FavouriteModule,
        SuspectsModule,
    ],
    providers: [
        VideosService,
        ShowVideosScene,
        FindVideoScene,
        UploadVideoScene,
    ],
})
export class VideosModule {}
