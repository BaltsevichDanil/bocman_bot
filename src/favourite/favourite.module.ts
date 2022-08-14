import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { VideoEntity } from '../videos/entities/video.entity'

import { FavouriteEntity } from './entities/favourite.entity'
import { FavouriteService } from './favourite.service'

@Module({
    imports: [TypeOrmModule.forFeature([FavouriteEntity, VideoEntity])],
    providers: [FavouriteService],
    exports: [FavouriteService],
})
export class FavouriteModule {}
