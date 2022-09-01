import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

import { RoleEnum } from '../../enums/role.enum'

@Entity('user')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('numeric')
    chat_id: number

    @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
    role: RoleEnum

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
    updatedAt: Date
}
