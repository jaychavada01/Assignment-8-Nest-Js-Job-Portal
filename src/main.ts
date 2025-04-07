import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Sequelize } from 'sequelize-typescript';
import { associateModels } from './modules/indexModel';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const sequelize = app.get(Sequelize);

  // ? Ensure all models are initialized before associating
  await sequelize.authenticate();
  associateModels();

  await sequelize.sync({ alter: true }); // This applies schema changes

  await app.listen(3000);
}
bootstrap();
