import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { FavouriteEntity } from '../favourite/entities/favourite.entity'
import { VideoEntity } from '../videos/entities/video.entity'

import { MakeSuspectDto } from './dtos/make-suspect.dto'
import { SuspectEntity } from './entities/suspect.entity'

@Injectable()
export class SuspectsService {
    constructor(
        @InjectRepository(SuspectEntity)
        private readonly _suspectsRepository: Repository<SuspectEntity>,
        @InjectRepository(VideoEntity)
        private readonly _videosRepository: Repository<FavouriteEntity>,
    ) {}

    async makeSuspect(data: MakeSuspectDto): Promise<SuspectEntity> {
        const video = await this._videosRepository.findOne({
            where: { message_id: data.message_id },
            select: ['id'],
        })
        if (!video) {
            throw new Error('Такого видео нет')
        }
        const candidate = await this._suspectsRepository.findOne({
            where: {
                who_complained: data.who_complained,
                video: { message_id: data.message_id },
            },
            relations: ['video'],
        })
        if (candidate) {
            return candidate
        }
        return await this._suspectsRepository.save({
            who_complained: data.who_complained,
            video,
        })
    }
}
