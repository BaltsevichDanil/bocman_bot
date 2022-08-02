import { MigrationInterface, QueryRunner } from 'typeorm'

export class VideoRefactorMigration1659355746812 implements MigrationInterface {
    name = 'VideoRefactorMigration1659355746812'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "video" DROP COLUMN "owner_id"
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "video"
            ADD "owner_id" uuid NOT NULL
        `)
    }
}
