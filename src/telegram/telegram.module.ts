import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FavouriteEntity } from './entities/favourite.entity'
import { UserEntity } from './entities/user.entity'
import { VideoEntity } from './entities/video.entity'
import { FindAllVideosScene } from './scenes/findAllVideos.scene'
import { FindVideoScene } from './scenes/findVideo.scene'
import { UploadVideoScene } from './scenes/uploadVideo.scene'
import { TelegramService } from './telegram.service'
import { TelegramUpdate } from './telegram.update'

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, VideoEntity, FavouriteEntity]),
    ],
    providers: [
        TelegramService,
        TelegramUpdate,
        UploadVideoScene,
        FindVideoScene,
        FindAllVideosScene,
    ],
})
export class TelegramModule {}
