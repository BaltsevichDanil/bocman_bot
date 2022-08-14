import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateUserDto } from './dtos/create-user.dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly _usersRepository: Repository<UserEntity>,
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
}
