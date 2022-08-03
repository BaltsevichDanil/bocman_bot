import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'

import { findLimit } from '../constants/constants'
import { ClearText } from '../helpers/clearText'

import { AddToFavouriteDto } from './dtos/addToFavourite.dto'
import { CreateUserDto } from './dtos/createUser.dto'
import { CreateVideoDto } from './dtos/createVideo.dto'
import { FavouriteEntity } from './entities/favourite.entity'
import { SuspectEntity } from './entities/suspect.entity'
import { UserEntity } from './entities/user.entity'
import { VideoEntity } from './entities/video.entity'

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

    async findAllVideos(skip: number): Promise<VideoEntity[]> {
        return await this._videosRepository.find({ skip, take: findLimit })
    }

    async saveVideo(data: CreateVideoDto): Promise<VideoEntity> {
        return await this._videosRepository.save(data)
    }

    async addToFavourite(data: AddToFavouriteDto): Promise<FavouriteEntity> {
        const video = await this._videosRepository.findOne({
            where: { message_id: data.message_id },
        })
        if (!video) {
            throw new Error('Такого видео нет')
        }
        const favourite = await this._favouriteRepository.findOne({
            where: { chat_owner_id: data.chat_owner_id },
        })
        if (favourite) {
            return favourite
        }
        return await this._favouriteRepository.save({ ...data, video })
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

    async makeSuspect(
        who_complained: number,
        message_id: number,
    ): Promise<SuspectEntity> {
        const video = await this._videosRepository.findOne({
            where: { message_id },
        })
        if (!video) {
            throw new Error('Такого видео нет')
        }
        const suspect = await this._suspectRepository.findOne({
            video: { message_id },
        })
        if (suspect) {
            return suspect
        }
        return await this._suspectRepository.save({ who_complained, video })
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
