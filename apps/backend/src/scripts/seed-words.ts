import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { seedWords } from '../words/words.seeder';

async function run() {
  const dataSource = new DataSource(typeOrmConfig);

  try {
    console.log('Connecting to database...');
    await dataSource.initialize();
    console.log('Connected!');

    console.log('Seeding words...');
    await seedWords(dataSource);
    console.log('Done!');

    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding words:', error);
    process.exit(1);
  }
}

run();
