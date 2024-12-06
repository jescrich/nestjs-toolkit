import { ConsoleLogger, Injectable, Logger, LoggerService, Scope } from '@nestjs/common';
import { Inject, Optional } from '@nestjs/common';
import { isString } from 'lodash';
import * as _ from 'lodash';

@Injectable({ scope: Scope.TRANSIENT })
export class ContextLogger extends ConsoleLogger {
  constructor(readonly context: string) {
    super(context, { timestamp: true });
  }

  log(message: any, ...optionalParams: any[]) {
    super.log(`${this.tags(optionalParams)} ${message}`);
  }

  error(message: any, trace?: string, ...optionalParams: any[]) {
    super.error(`${this.tags(optionalParams)} ${message}`);
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    super.warn(`${this.tags(optionalParams)} ${message}`);
  }

  debug(message: any, ...optionalParams: any[]) {
    super.debug(`${this.tags(optionalParams)} ${message}`);
  }

  verbose(message: any, ...optionalParams: any[]) {
    super.verbose(`${this.tags(optionalParams)} ${message}`);
  }

  tags(optionalParams: any[]) {
    const r = optionalParams
      ? _.reverse(optionalParams).map((s: any) => `[${isString(s) ? s : JSON.stringify(s)}]`)
      : [];
    return r.join(' ');
  }
}
