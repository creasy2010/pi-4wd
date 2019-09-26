declare const __DEV__: boolean;


declare interface AsyncResult<T> {
  res: T;
  err: Error;
}


declare interface TResult {
  code: string
  message: string
  context: any
}


declare interface Wx {
  [name:string]:any;
}

declare interface wx {
  [name:string]:any;
}
