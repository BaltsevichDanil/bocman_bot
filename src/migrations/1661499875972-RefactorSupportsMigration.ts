import { MigrationInterface, QueryRunner } from 'typeorm'

export class RefactorSupportsMigration1661499875972
    implements MigrationInterface
{
    name = 'RefactorSupportsMigration1661499875972'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "supports"
            ADD "isClosed" boolean NOT NULL DEFAULT false
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "supports" DROP COLUMN "isClosed"
        `)
    }
}
