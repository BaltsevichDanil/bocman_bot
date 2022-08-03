import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserRefactorMigration1659497529147 implements MigrationInterface {
    name = 'UserRefactorMigration1659497529147'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')
        `)
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'user'
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "role"
        `)
        await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `)
    }
}
