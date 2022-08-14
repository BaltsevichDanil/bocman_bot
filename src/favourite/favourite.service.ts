import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { findLimit } from '../constants/constants'
import { VideoEntity } from '../videos/entities/video.entity'

import { AddToFavouriteDto } from './dtos/add-to-favourite.dto'
import { ShowFavouritesDto } from './dtos/show-favourites.dto'
import { FavouriteEntity } from './entities/favourite.entity'

@Injectable()
export class FavouriteService {
    constructor(
        @InjectRepository(FavouriteEntity)
        private readonly _favouritesRepository: Repository<FavouriteEntity>,
        @InjectRepository(VideoEntity)
        private readonly _videosRepository: Repository<VideoEntity>,
    ) {}

    async addToFavourite(data: AddToFavouriteDto): Promise<FavouriteEntity> {
        const video = await this._videosRepository.findOne({
            where: { message_id: data.message_id },
            select: ['id'],
        })
        if (!video) {
            throw new Error('Такого видео нет')
        }
        const candidate = await this._favouritesRepository.findOne({
            where: {
                chat_owner_id: data.chat_owner_id,
                video: { message_id: data.message_id },
            },
            relations: ['video'],
        })
        if (candidate) {
            throw new Error('Видео уже в избранных')
        }
        return await this._favouritesRepository.save({ ...data, video })
    }

    async showFavourites(data: ShowFavouritesDto): Promise<FavouriteEntity[]> {
        return await this._favouritesRepository.find({
            where: { chat_owner_id: data.chat_owner_id },
            take: findLimit,
            skip: data.skip,
            relations: ['video'],
        })
    }

    async showVideo(message_id: number): Promise<VideoEntity | undefined> {
        return await this._videosRepository.findOne({ where: { message_id } })
    }
}
