import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TelegrafModule } from 'nestjs-telegraf'

import { config } from './config/config'
import { telegrafConfig } from './config/telegraf.config'
import { typeOrmConfig } from './config/typeorm.config'
import { FavouriteModule } from './favourite/favourite.module'
import { SupportsModule } from './supports/supports.module'
import { SuspectsModule } from './suspects/suspects.module'
import { TelegramModule } from './telegram/telegram.module'
import { UsersModule } from './users/users.module'
import { VideosModule } from './videos/videos.module'

@Module({
    imports: [
        ConfigModule.forRoot(config),
        TypeOrmModule.forRootAsync(typeOrmConfig),
        TelegrafModule.forRootAsync(telegrafConfig),
        TelegramModule,
        VideosModule,
        FavouriteModule,
        SuspectsModule,
        UsersModule,
        SupportsModule,
    ],
})
export class AppModule {}
