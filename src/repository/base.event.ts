import { IsString } from 'class-validator';

export default class BaseEvent {
  @IsString()
  Id?: string;
  @IsString()
  Type?: string;
  @IsString()
  Service?: string;
  @IsString()
  Timestamp?: string;
}
