import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUserMigration1659272751548 implements MigrationInterface {
    name = 'CreateUserMigration1659272751548'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" text NOT NULL,
                "chat_id" integer NOT NULL,
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "user"
        `)
    }
}
