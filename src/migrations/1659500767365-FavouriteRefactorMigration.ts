import { MigrationInterface, QueryRunner } from 'typeorm'

export class FavouriteRefactorMigration1659500767365
    implements MigrationInterface
{
    name = 'FavouriteRefactorMigration1659500767365'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "favourite" DROP CONSTRAINT "FK_fcca85242ed5cb7dae761966c4d"
        `)
        await queryRunner.query(`
            ALTER TABLE "favourite"
            ADD CONSTRAINT "FK_fcca85242ed5cb7dae761966c4d" FOREIGN KEY ("videoId") REFERENCES "video"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "favourite" DROP CONSTRAINT "FK_fcca85242ed5cb7dae761966c4d"
        `)
        await queryRunner.query(`
            ALTER TABLE "favourite"
            ADD CONSTRAINT "FK_fcca85242ed5cb7dae761966c4d" FOREIGN KEY ("videoId") REFERENCES "video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    }
}
