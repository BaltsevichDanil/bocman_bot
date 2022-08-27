import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateSupportDto } from './dtos/create-support.dto'
import { SupportEntity } from './entities/support.entity'

@Injectable()
export class SupportsService {
    constructor(
        @InjectRepository(SupportEntity)
        private readonly _supportsRepository: Repository<SupportEntity>,
    ) {}

    async findSupport(id: string): Promise<SupportEntity | undefined> {
        return await this._supportsRepository.findOne({ id, isClosed: false })
    }

    async createSupport(data: CreateSupportDto): Promise<SupportEntity> {
        return await this._supportsRepository.save(data)
    }

    async closeSupport(id: string): Promise<boolean> {
        const support = await this._supportsRepository.findOne({
            where: { id, isClosed: false },
        })
        if (support) {
            await this._supportsRepository.update({ id }, { isClosed: true })
            return true
        }
        return false
    }

    async getLastSupport(): Promise<SupportEntity | undefined> {
        return await this._supportsRepository.findOne({
            where: { isClosed: false },
            order: { createdAt: 'DESC' },
        })
    }
}
