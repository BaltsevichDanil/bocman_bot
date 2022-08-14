import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { findLimit } from '../constants/constants'

import { VideoEntity } from './entities/video.entity'

@Injectable()
export class VideosService {
    constructor(
        @InjectRepository(VideoEntity)
        private readonly _videosRepository: Repository<VideoEntity>,
    ) {}

    async findAllVideos(skip: number): Promise<VideoEntity[]> {
        return await this._videosRepository.find({ skip, take: findLimit })
    }

    async findVideo(message_id: number): Promise<VideoEntity | undefined> {
        return await this._videosRepository.findOne({ where: { message_id } })
    }
}
