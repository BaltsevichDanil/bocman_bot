import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { VideoEntity } from '../videos/entities/video.entity'

import { SuspectEntity } from './entities/suspect.entity'
import { SuspectsService } from './suspects.service'

@Module({
    imports: [TypeOrmModule.forFeature([SuspectEntity, VideoEntity])],
    providers: [SuspectsService],
    exports: [SuspectsService],
})
export class SuspectsModule {}
