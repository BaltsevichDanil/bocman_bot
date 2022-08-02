import { MigrationInterface, QueryRunner } from 'typeorm'

export class RefactorUserMigration1659273185590 implements MigrationInterface {
    name = 'RefactorUserMigration1659273185590'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "username" DROP NOT NULL
        `)
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"
        `)
        await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "username"
            SET NOT NULL
        `)
    }
}
