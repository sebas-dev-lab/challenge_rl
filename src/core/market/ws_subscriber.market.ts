import { IsEnum, IsString } from 'class-validator';

export enum timeFrames {
  '1m' = '1m',
  '5m' = '5m',
  '15m' = '15m',
  '30m' = '30m',
  '1h' = '1h',
  '3h' = '3h',
  '6h' = '6h',
  '12h' = '12h',
  '1D' = '1D',
  '1W' = '1W',
  '14D' = '14D',
  '1M' = '1M'
}
export type subscribers = {
  _id: string
  channel: string
  date: Date
  active: boolean
  event: eventSubscribers
  targes: {
    key?: string
    pair?: string
  }
}

export enum channelSubscribers {
  'candles' = 'candles',
  'ticker' = 'ticker',
  'book' = 'book'
}

export enum eventSubscribers {
  'subscribe' = 'subscribe',
  'unsubscribe' = 'subscribe'
}

export class TickerSubscriberToBx {
  @IsString()
      event!: eventSubscribers;
  @IsString()
      channel!: string;
  @IsString()
      symbol!: string;
}

export class CandlesSubscribeFromCli extends TickerSubscriberToBx {
  @IsEnum(timeFrames)
      time_frame!: timeFrames;
}

export class CandlesSubscriberToBx {
  @IsString()
      event!: eventSubscribers;
  @IsString()
      channel!: string;
  @IsString()
      key!: string;
}

export type fromCliSubscriberTypes = CandlesSubscribeFromCli | TickerSubscriberToBx
