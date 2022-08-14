import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

import { VideoEntity } from '../../videos/entities/video.entity'

@Entity('favourite')
export class FavouriteEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    chat_owner_id: number

    @ManyToOne(() => VideoEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    video: VideoEntity

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
    updatedAt: Date
}
