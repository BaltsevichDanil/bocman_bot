import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UsersModule } from '../users/users.module'

import { SupportEntity } from './entities/support.entity'
import { ReadSupportScene } from './scenes/read-support.scene'
import { SendSupportScene } from './scenes/send-support.scene'
import { SupportsService } from './supports.service'

@Module({
    imports: [TypeOrmModule.forFeature([SupportEntity]), UsersModule],
    providers: [SupportsService, SendSupportScene, ReadSupportScene],
})
export class SupportsModule {}
