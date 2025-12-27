import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm";

export class CreateRoomsTable1766803680803 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'rooms',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'room_code',
                        type: 'varchar',
                        length: '6',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'host_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['waiting', 'team_setup', 'in_progress', 'finished'],
                        default: "'waiting'",
                        isNullable: false,
                    },
                    {
                        name: 'max_players',
                        type: 'int',
                        default: 8,
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false,
                    },
                    {
                        name: 'started_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'finished_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
            }),
            true,
        );

        // Crear índice único para room_code
        await queryRunner.createIndex(
            'rooms',
            new TableIndex({
                name: 'idx_room_code',
                columnNames: ['room_code'],
                isUnique: true,
            }),
        );

        // Crear foreign key hacia la tabla users
        await queryRunner.createForeignKey(
            'rooms',
            new TableForeignKey({
                columnNames: ['host_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar foreign key
        const table = await queryRunner.getTable('rooms');
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('host_id') !== -1,
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey('rooms', foreignKey);
        }

        // Eliminar índice
        await queryRunner.dropIndex('rooms', 'idx_room_code');

        // Eliminar tabla
        await queryRunner.dropTable('rooms');
    }

}
