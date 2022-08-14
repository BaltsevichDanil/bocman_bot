import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { VideoEntity } from '../videos/entities/video.entity'

import { MakeSuspectDto } from './dtos/make-suspect.dto'
import { SuspectEntity } from './entities/suspect.entity'

@Injectable()
export class SuspectsService {
    constructor(
        @InjectRepository(SuspectEntity)
        private readonly _suspectsRepository: Repository<SuspectEntity>,
        @InjectRepository(VideoEntity)
        private readonly _videosRepository: Repository<VideoEntity>,
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

    async getSuspects(): Promise<SuspectEntity[]> {
        return await this._suspectsRepository.find({
            take: 1,
            relations: ['video'],
        })
    }

    async banVideo(message_id: number): Promise<void> {
        await this._videosRepository.delete({ message_id })
    }

    async deleteFromSuspect(message_id: number): Promise<void> {
        const suspect = await this._suspectsRepository.findOne({
            where: { video: { message_id } },
            relations: ['video'],
        })
        await this._suspectsRepository.delete({ id: suspect?.id })
    }
}
