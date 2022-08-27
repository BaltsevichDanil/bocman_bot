import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSupportsMigration1661499402703
    implements MigrationInterface
{
    name = 'CreateSupportsMigration1661499402703'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "supports" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "chat_id" integer NOT NULL,
                "text" text NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_d8c2a7cbebc6494f00dda770105" PRIMARY KEY ("id")
            )
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "supports"
        `)
    }
}
