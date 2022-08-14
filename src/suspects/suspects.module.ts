import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UsersModule } from '../users/users.module'
import { VideoEntity } from '../videos/entities/video.entity'

import { SuspectEntity } from './entities/suspect.entity'
import { ShowSuspectsScene } from './scenes/show-suspects.scene'
import { SuspectsService } from './suspects.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([SuspectEntity, VideoEntity]),
        UsersModule,
    ],
    providers: [SuspectsService, ShowSuspectsScene],
    exports: [SuspectsService],
})
export class SuspectsModule {}
