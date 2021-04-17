export class DonationModel {
    constructor(
        public id: string,
        public paperId: string,
        public currentState: number,
        public issueDateTime: string,
        public issuer: string,
        public amount: string,
        ) { }
}

export class DonationByUserModel extends DonationModel {
    constructor(
        public id: string,
        public paperId: string,
        public currentState: number,
        public issueDateTime: string,
        public issuer: string,
        public amount: string,
        public redeemDate: string,
        public redeemer: string,
        ) {
        super(id, paperId,currentState, issueDateTime,issuer,amount);
    }
}
