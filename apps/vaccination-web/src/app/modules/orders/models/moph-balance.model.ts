export class MOPHBalanceModel {
    constructor(
        public id: string,
        public currentState: string,
        public payedAmount: number,
        public redeemedAmount: number
    ) { }
}
