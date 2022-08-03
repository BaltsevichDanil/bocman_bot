import { MigrationInterface, QueryRunner } from 'typeorm'

export class SuspectRefactorMigration1659510562334
    implements MigrationInterface
{
    name = 'SuspectRefactorMigration1659510562334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "suspect" DROP CONSTRAINT "FK_ec4b13e12e50716a7bf1ec5aae3"
        `)
        await queryRunner.query(`
            ALTER TABLE "suspect" DROP CONSTRAINT "REL_ec4b13e12e50716a7bf1ec5aae"
        `)
        await queryRunner.query(`
            ALTER TABLE "suspect"
            ADD CONSTRAINT "FK_ec4b13e12e50716a7bf1ec5aae3" FOREIGN KEY ("videoId") REFERENCES "video"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "suspect" DROP CONSTRAINT "FK_ec4b13e12e50716a7bf1ec5aae3"
        `)
        await queryRunner.query(`
            ALTER TABLE "suspect"
            ADD CONSTRAINT "REL_ec4b13e12e50716a7bf1ec5aae" UNIQUE ("videoId")
        `)
        await queryRunner.query(`
            ALTER TABLE "suspect"
            ADD CONSTRAINT "FK_ec4b13e12e50716a7bf1ec5aae3" FOREIGN KEY ("videoId") REFERENCES "video"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `)
    }
}
