import { MigrationInterface, QueryRunner } from 'typeorm'

export class FavouriteCreateMigration1659447936929
    implements MigrationInterface
{
    name = 'FavouriteCreateMigration1659447936929'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "favourite" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "chat_owner_id" integer NOT NULL,
                "message_id" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_56f1996fc2983d1895e4a8f3af3" PRIMARY KEY ("id")
            )
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "favourite"
        `)
    }
}
