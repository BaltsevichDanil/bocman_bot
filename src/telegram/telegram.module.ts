import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FavouriteEntity } from '../favourite/entities/favourite.entity'
import { SuspectEntity } from '../suspects/entities/suspect.entity'
import { VideoEntity } from '../videos/entities/video.entity'

import { UserEntity } from './entities/user.entity'
import { FindVideoScene } from './scenes/findVideo.scene'
import { ShowFavouriteScene } from './scenes/showFavourite.scene'
import { ShowSuspectsScene } from './scenes/showSuspects.scene'
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
        ShowFavouriteScene,
        FavouriteEntity,
        ShowSuspectsScene,
    ],
})
export class TelegramModule {}
