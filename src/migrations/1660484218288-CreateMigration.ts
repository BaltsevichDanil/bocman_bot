import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMigration1660484218288 implements MigrationInterface {
    name = 'CreateMigration1660484218288'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "video" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "owner_chat_id" integer NOT NULL,
                "text" text NOT NULL,
                "message_id" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`
            CREATE INDEX "IDX_64faf9e23eb880010d626b93dd" ON "video" ("text")
        `)
        await queryRunner.query(`
            CREATE TABLE "suspect" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "who_complained" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "videoId" uuid,
                CONSTRAINT "PK_16005690ebcabb6ec78c1646b96" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`
            CREATE TABLE "favourite" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "chat_owner_id" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "videoId" uuid,
                CONSTRAINT "PK_56f1996fc2983d1895e4a8f3af3" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')
        `)
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "chat_id" integer NOT NULL,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'user',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`
            ALTER TABLE "suspect"
            ADD CONSTRAINT "FK_ec4b13e12e50716a7bf1ec5aae3" FOREIGN KEY ("videoId") REFERENCES "video"("id") ON DELETE CASCADE ON UPDATE NO ACTION
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
            ALTER TABLE "suspect" DROP CONSTRAINT "FK_ec4b13e12e50716a7bf1ec5aae3"
        `)
        await queryRunner.query(`
            DROP TABLE "user"
        `)
        await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `)
        await queryRunner.query(`
            DROP TABLE "favourite"
        `)
        await queryRunner.query(`
            DROP TABLE "suspect"
        `)
        await queryRunner.query(`
            DROP INDEX "public"."IDX_64faf9e23eb880010d626b93dd"
        `)
        await queryRunner.query(`
            DROP TABLE "video"
        `)
    }
}
