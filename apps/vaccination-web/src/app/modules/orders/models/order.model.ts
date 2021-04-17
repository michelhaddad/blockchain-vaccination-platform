export class OrderModel {
    constructor(
        public id: string,
        public orderID: string,
        public currentState: number,
        public issueDateTime: string,
        public issuer: string,
        public requestedArrivalDate: string,
        public vialsAmount: number,
        public manufacturer: string,
        public destination: string,
        public fee?: number,
        public expectedDeliveryDate?: string,
        public batchNumber?: string,
    ) { }
}

export class OrderIssueModel {
    constructor(
        public manufacturer: string,
        public destination: string,
        public vialsAmount: number,
        public requestedArrivalDate: string
    ) { }
}

export enum OrderStateEnum {
    REQUESTED = 1,
    APPROVED = 2,
    SHIPPED = 3,
    DELIVERED = 4,
    REJECTED = -1
}

export class OrderApproveModel {
    constructor(
        public batchNumber: string,
        public expectedDeliveryDate: string
    ) { }
}