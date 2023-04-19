import { HttpService, HttpModule as BaseHttpModule } from '@nestjs/axios';
import { Logger, Module, OnModuleInit } from '@nestjs/common';

@Module({
  imports: [BaseHttpModule],
  exports: [BaseHttpModule],
})
export class HttpModule implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onModuleInit(): any {
    const logger = new Logger('AxiosInterceptor');

    const axios = this.httpService.axiosRef;

    axios.interceptors.request.use((config) => {
      config['metadata'] = { ...config['metadata'], startDate: new Date() };
      logger.verbose(`${config.method.toUpperCase()} ${config.baseURL} ${config.url}`);
      return config;
    });

    axios.interceptors.response.use(
      (response) => {
        const { config, request, status, statusText } = response;
        config['metadata'] = { ...config['metadata'], endDate: new Date() };
        const duration = config['metadata'].endDate.getTime() - config['metadata'].startDate.getTime();
        logger.verbose(
          `Finished ${request.method} request to ${config.baseURL} ${config.url} with status ${status} ${statusText} in ${duration}ms`
        );

        return response;
      },
      (error) => {
        logger.error(`Error on ${error.config.method} request to ${error.config.url} with error ${error.message}`);
        logger.error(error);

        return Promise.reject(error);
      }
    );
  }
}