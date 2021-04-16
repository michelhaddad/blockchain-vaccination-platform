export class ApiResponseModel<T> {
    constructor(
        public response: ResponseModel<T>[]
    ) {}
  }
  
  export class ResponseModel<T> {
    constructor(
        public key: string,
        public records: T[]
    ) {}
  }
  
