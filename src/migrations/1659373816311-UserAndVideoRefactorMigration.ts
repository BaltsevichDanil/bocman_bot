import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserAndVideoRefactorMigration1659373816311
    implements MigrationInterface
{
    name = 'UserAndVideoRefactorMigration1659373816311'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"
        `)
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "username"
        `)
        await queryRunner.query(`
            ALTER TABLE "video"
            ADD "owner_chat_id" integer NOT NULL
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "video" DROP COLUMN "owner_chat_id"
        `)
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "username" text
        `)
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")
        `)
    }
}
