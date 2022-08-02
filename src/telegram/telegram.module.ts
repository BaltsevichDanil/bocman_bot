import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FavouriteEntity } from './entities/favourite.entity'
import { SuspectEntity } from './entities/suspect.entity'
import { UserEntity } from './entities/user.entity'
import { VideoEntity } from './entities/video.entity'
import { FindAllVideosScene } from './scenes/findAllVideos.scene'
import { FindVideoScene } from './scenes/findVideo.scene'
import { ShowFavouriteScene } from './scenes/showFavourite.scene'
import { UploadVideoScene } from './scenes/uploadVideo.scene'
import { TelegramService } from './telegram.service'
import { TelegramUpdate } from './telegram.update'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            VideoEntity,
            FavouriteEntity,
            SuspectEntity,
        ]),
    ],
    providers: [
        TelegramService,
        TelegramUpdate,
        UploadVideoScene,
        FindVideoScene,
        FindAllVideosScene,
        ShowFavouriteScene,
        FavouriteEntity,
    ],
})
export class TelegramModule {}
