import { Module } from '@nestjs/common'

import { FavouriteEntity } from '../favourite/entities/favourite.entity'
import { UsersModule } from '../users/users.module'

import { TelegramUpdate } from './telegram.update'

@Module({
    imports: [UsersModule],
    providers: [TelegramUpdate, FavouriteEntity],
})
export class TelegramModule {}
