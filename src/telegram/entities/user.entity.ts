import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity('user')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    chat_id: number

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
    updatedAt: Date
}
