import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserAndVideoRefactorMigration1659349019349
    implements MigrationInterface
{
    name = 'UserAndVideoRefactorMigration1659349019349'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "video"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `)
        await queryRunner.query(`
            ALTER TABLE "video"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `)
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `)
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `)
        await queryRunner.query(`
            ALTER TABLE "video" DROP COLUMN "message_id"
        `)
        await queryRunner.query(`
            ALTER TABLE "video"
            ADD "message_id" integer NOT NULL
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "video" DROP COLUMN "message_id"
        `)
        await queryRunner.query(`
            ALTER TABLE "video"
            ADD "message_id" character varying NOT NULL
        `)
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "updated_at"
        `)
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "created_at"
        `)
        await queryRunner.query(`
            ALTER TABLE "video" DROP COLUMN "updated_at"
        `)
        await queryRunner.query(`
            ALTER TABLE "video" DROP COLUMN "created_at"
        `)
    }
}
