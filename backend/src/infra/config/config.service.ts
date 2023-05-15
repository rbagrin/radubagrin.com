import * as dotenv from 'dotenv';

export class ConfigService {
  private readonly envConfig: Record<string, string>;
  constructor() {
    // if (process.env.NODE_ENV !== 'production') {
    //   dotenv.config();
    // }
    const result = dotenv.config();

    if (result.error) {
      this.envConfig = process.env;
    } else {
      this.envConfig = result.parsed;
    }
  }

  private get(key: string): string {
    return this.envConfig[key];
  }

  public async getPortConfig() {
    return this.get('BACKEND_PORT');
  }

  public async getMongoConfig() {
    return {
      uri:
        'mongodb+srv://' +
        this.get('MONGO_ATLAS_USERNAME') +
        ':' +
        this.get('MONGO_ATLAS_PASSWORD') +
        '@websitedb.ujudalm.mongodb.net/?retryWrites=true&w=majority',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  }
}
