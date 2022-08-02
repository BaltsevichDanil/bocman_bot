import { MigrationInterface, QueryRunner } from 'typeorm'

export class FavouriteRefactorMigration1659452085626
    implements MigrationInterface
{
    name = 'FavouriteRefactorMigration1659452085626'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "favourite"
                RENAME COLUMN "message_id" TO "videoId"
        `)
        await queryRunner.query(`
            ALTER TABLE "favourite" DROP COLUMN "videoId"
        `)
        await queryRunner.query(`
            ALTER TABLE "favourite"
            ADD "videoId" uuid
        `)
        await queryRunner.query(`
            ALTER TABLE "favourite"
            ADD CONSTRAINT "UQ_fcca85242ed5cb7dae761966c4d" UNIQUE ("videoId")
        `)
        await queryRunner.query(`
            ALTER TABLE "favourite"
            ADD CONSTRAINT "FK_fcca85242ed5cb7dae761966c4d" FOREIGN KEY ("videoId") REFERENCES "video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "favourite" DROP CONSTRAINT "FK_fcca85242ed5cb7dae761966c4d"
        `)
        await queryRunner.query(`
            ALTER TABLE "favourite" DROP CONSTRAINT "UQ_fcca85242ed5cb7dae761966c4d"
        `)
        await queryRunner.query(`
            ALTER TABLE "favourite" DROP COLUMN "videoId"
        `)
        await queryRunner.query(`
            ALTER TABLE "favourite"
            ADD "videoId" integer NOT NULL
        `)
        await queryRunner.query(`
            ALTER TABLE "favourite"
                RENAME COLUMN "videoId" TO "message_id"
        `)
    }
}
