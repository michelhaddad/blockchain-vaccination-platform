export class PlanModel {
    constructor(
        public id: string,
        public orderID: string,
        public deliveryID: string,
        public currentState: number,
        public issueDateTime: string,
        public issuer: string,
        public storage: string,
        public vialsAmount: number,
        public hospitalID: number,
        public arrivalDateTime: string,
        public updateDateTime: string,
        public batchNumber: string
    ) { }
}
