import { Injectable, LoggerService } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class AppLogger implements LoggerService {
  private logger = new Logger('AppLogger');

  log(message: string) {
    this.logger.log(message);
  }
  error(message: string, trace?: string) {
    this.logger.error(message, trace);
  }
  warn(message: string) {
    this.logger.warn(message);
  }
  debug(message: string) {
    this.logger.debug(message);
  }
  verbose(message: string) {
    this.logger.verbose(message);
  }
}
