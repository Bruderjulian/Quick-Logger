declare class Transport {
  public format?: Function;
  public level?: string;
  public silent?: boolean;
  public handleExceptions?: boolean;
  public handleRejections?: boolean;

  constructor(opts?: Transport.TransportOptions);

  public _write(info: any, next: () => void): any;
  public _write(info: any): any;
  public _open?(): void;
  public _close?(): void;

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

    _write(info: any, next: () => void): any;
    _write(info: any): any;
    _open?(callback?): void;
    _close?(callback?): void;
  }
}

export = Transport;
