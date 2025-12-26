import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateUsersTable1766764533497 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Habilitar la extensión uuid-ossp PRIMERO
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                        length: '50',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '255',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'password_hash',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        default: true,
                        isNullable: false,
                    },
                    {
                        name: 'last_login',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false,
                    },
                ],
            }),
            true,
        );

        // Crear índices únicos para username y email
        await queryRunner.createIndex(
            'users',
            new TableIndex({
                name: 'idx_username',
                columnNames: ['username'],
                isUnique: true,
            }),
        );

        await queryRunner.createIndex(
            'users',
            new TableIndex({
                name: 'idx_email',
                columnNames: ['email'],
                isUnique: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar índices
        await queryRunner.dropIndex('users', 'idx_email');
        await queryRunner.dropIndex('users', 'idx_username');

        // Eliminar tabla
        await queryRunner.dropTable('users');
    }

}
