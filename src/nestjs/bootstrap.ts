import { HttpService } from '@nestjs/axios';
import { Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { CorrelationIdInterceptor } from './interceptors/correlation.id';
import { ContextLogger } from './logger/context.logger';
import * as morgan from 'morgan';

const bootstrap = async (
  application: any,
  options?: NestApplicationOptions,
  config?: {
    microservice?: {
      enabled: boolean;
      host: string;
      port: number;
    };
  },
) => {
  Logger.log(`Bootstrapping`, process.env.npm_package_name);

  const app = await NestFactory.create(application, {
    logger: new ContextLogger(process.env.npm_package_name ?? ''),
  });

  const microservice = config?.microservice?.enabled;

  if (microservice) {
    const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(application, {
      transport: Transport.TCP,
      options: {
        host: config?.microservice?.host,
        port: config?.microservice?.port,
      },
    });
    await microservice.listen();
  }

  app.useGlobalPipes(new ValidationPipe());

  const service = app.get<HttpService>(HttpService);

  if (!service) {
    throw new Error('HttpService not found, check if you have imported the NestJsModule or HttpModule');
  }

  app.useGlobalInterceptors(new CorrelationIdInterceptor(service));

  morgan.token('id', function getId(req: any) {
    return req.headers['x-correlation-id']?.toString();
  });

  app.use(
    morgan('[:id] :method :url :response-time', {
      stream: {
        write: (message: any) => {
          Logger.log(message, 'HTTP');
        },
      },
      skip: (req: any, res: any) => {
        return req.url.includes('api-explorer') || req.url.includes('health') || req.url.includes('healthcheck');
      },
    }),
  );

  if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
  }

  const swaggerConfig = new DocumentBuilder()
    .setVersion(`${process.env.npm_package_version}`)
    .addServer(`/${process.env.npm_package_name}`)
    .setDescription(`${process.env.npm_package_description}`)
    .setTitle(`${process.env.npm_package_description}`)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-explorer', app, document);

  const port = process.env.PORT || 3000;

  Logger.log(`Starting ${process.env.npm_package_name} on port ${port}`, process.env.npm_package_name);
  await app.listen(port);
};

export { bootstrap };
