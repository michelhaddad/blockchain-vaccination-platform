export class LoginResponseModel {
    constructor(
        public isAdmin: boolean,
        public token: string,
        public organizationId: number
    ) {}
  }
  