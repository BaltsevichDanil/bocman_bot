import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSuspectMigration1659463604791 implements MigrationInterface {
    name = 'CreateSuspectMigration1659463604791'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "suspect" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "who_complained" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "videoId" uuid,
                CONSTRAINT "REL_ec4b13e12e50716a7bf1ec5aae" UNIQUE ("videoId"),
                CONSTRAINT "PK_16005690ebcabb6ec78c1646b96" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`
            ALTER TABLE "suspect"
            ADD CONSTRAINT "FK_ec4b13e12e50716a7bf1ec5aae3" FOREIGN KEY ("videoId") REFERENCES "video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "suspect" DROP CONSTRAINT "FK_ec4b13e12e50716a7bf1ec5aae3"
        `)
        await queryRunner.query(`
            DROP TABLE "suspect"
        `)
    }
}
