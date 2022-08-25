import { Module } from '@nestjs/common'

import { FavouriteEntity } from '../favourite/entities/favourite.entity'
import { UsersModule } from '../users/users.module'
import { VideosModule } from '../videos/videos.module'

import { TelegramUpdate } from './telegram.update'

@Module({
    imports: [UsersModule, VideosModule],
    providers: [TelegramUpdate, FavouriteEntity],
})
export class TelegramModule {}
