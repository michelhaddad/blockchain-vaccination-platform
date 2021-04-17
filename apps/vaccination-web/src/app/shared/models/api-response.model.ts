export class ApiResponseModel<T> {
    constructor(
        public response: ResponseModel<T>[]
    ) {}
  }
  
  export class ResponseModel<T> {
    constructor(
        public Key: string,
        public Record: T
    ) {}
  }
  
