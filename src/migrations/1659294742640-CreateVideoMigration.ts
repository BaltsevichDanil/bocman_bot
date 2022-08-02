import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateVideoMigration1659294742640 implements MigrationInterface {
    name = 'CreateVideoMigration1659294742640'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "video" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "text" text NOT NULL,
                "message_id" character varying NOT NULL,
                "owner_id" uuid NOT NULL,
                CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id")
            )
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "video"
        `)
    }
}
