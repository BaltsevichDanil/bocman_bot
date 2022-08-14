import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'

import { findLimit } from '../constants/constants'
import { FavouriteEntity } from '../favourite/entities/favourite.entity'
import { ClearText } from '../helpers/clearText'
import { SuspectEntity } from '../suspects/entities/suspect.entity'
import { VideoEntity } from '../videos/entities/video.entity'

import { CreateUserDto } from './dtos/createUser.dto'
import { CreateVideoDto } from './dtos/createVideo.dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class TelegramService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly _usersRepository: Repository<UserEntity>,
        @InjectRepository(VideoEntity)
        private readonly _videosRepository: Repository<VideoEntity>,
        @InjectRepository(FavouriteEntity)
        private readonly _favouriteRepository: Repository<FavouriteEntity>,
        @InjectRepository(SuspectEntity)
        private readonly _suspectRepository: Repository<SuspectEntity>,
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

    async findFavourite(
        chat_owner_id: number,
        skip: number,
    ): Promise<FavouriteEntity[]> {
        return await this._favouriteRepository.find({
            where: { chat_owner_id },
            take: findLimit,
            skip,
            relations: ['video'],
        })
    }

    async getSuspects(): Promise<SuspectEntity[]> {
        return await this._suspectRepository.find({
            take: 1,
            relations: ['video'],
        })
    }

    async banVideo(message_id: number): Promise<void> {
        await this._videosRepository.delete({ message_id })
    }

    async deleteFromSuspect(message_id: number): Promise<void> {
        const suspect = await this._suspectRepository.findOne({
            where: { video: { message_id } },
            relations: ['video'],
        })
        await this._suspectRepository.delete({ id: suspect?.id })
    }
}
