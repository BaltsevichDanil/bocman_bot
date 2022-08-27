import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity('supports')
export class SupportEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    chat_id: number

    @Column('text')
    text: string

    @Column('boolean', { default: false })
    isClosed: boolean

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
    updatedAt: Date
}
