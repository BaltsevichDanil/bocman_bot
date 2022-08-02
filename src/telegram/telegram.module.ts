import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity } from './entities/user.entity'
import { VideoEntity } from './entities/video.entity'
import { FindVideoScene } from './scenes/findVideo.scene'
import { UploadVideoScene } from './scenes/uploadVideo.scene'
import { TelegramService } from './telegram.service'
import { TelegramUpdate } from './telegram.update'

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, VideoEntity])],
    providers: [
        TelegramService,
        TelegramUpdate,
        UploadVideoScene,
        FindVideoScene,
    ],
})
export class TelegramModule {}
