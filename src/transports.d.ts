declare class Transport {
  public format?: Function;
  public level?: string;
  public silent?: boolean;
  public handleExceptions?: boolean;
  public handleRejections?: boolean;

  constructor(opts?: Transport.TransportOptions);

  public log(info: any, next: () => void): any;
  public log(info: any): any;
  public open?(): void;
  public close?(): void;

  public static create(name: string, cls: Transport): Transport;
  public static load(name: string): Transport;
}

declare namespace Transport {
  interface TransportOptions {
    format?: Function;
    level?: string | number;
    silent?: boolean;
    handleExceptions?: boolean;
    handleRejections?: boolean;

    log(info: any, next: () => void): any;
    log(info: any): any;
    open?(callback?): void;
    close?(callback?): void;
  }
}

export = Transport;
