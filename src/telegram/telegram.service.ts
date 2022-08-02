import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'

import { ClearText } from '../helpers/clearText'

import { CreateUserDto } from './dtos/createUser.dto'
import { CreateVideoDto } from './dtos/createVideo.dto'
import { UserEntity } from './entities/user.entity'
import { VideoEntity } from './entities/video.entity'

@Injectable()
export class TelegramService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly _usersRepository: Repository<UserEntity>,
        @InjectRepository(VideoEntity)
        private readonly _videosRepository: Repository<VideoEntity>,
    ) {}

    async findUser(chat_id: number): Promise<UserEntity | undefined> {
        return await this._usersRepository.findOne({ chat_id })
    }

    async createUser(data: CreateUserDto): Promise<UserEntity> {
        const user = await this.findUser(data.chat_id)
        if (user) {
            return user
        }
        return await this._usersRepository.save(data)
    }

    async findVideo(text: string): Promise<VideoEntity | undefined> {
        return await this._videosRepository.findOne({
            where: { text: ILike(ClearText(text)) },
        })
    }

    async saveVideo(data: CreateVideoDto): Promise<VideoEntity> {
        return await this._videosRepository.save(data)
    }
}
