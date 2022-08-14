import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { VideoEntity } from '../videos/entities/video.entity'

import { FavouriteEntity } from './entities/favourite.entity'
import { FavouriteService } from './favourite.service'
import { ShowFavouriteScene } from './scenes/show-favourite.scene'

@Module({
    imports: [TypeOrmModule.forFeature([FavouriteEntity, VideoEntity])],
    providers: [FavouriteService, ShowFavouriteScene],
    exports: [FavouriteService],
})
export class FavouriteModule {}
