export class OrderRowModel {
    constructor(
        public orderId: string,
        public issueDateTime: string,
        public issuer: string,
        public requestedArrivalDate: string,
        public expectedArrivalDate: string,
        public batchNumber: string,
        public vialsAmount: number,
        public status: string,
        public manufacturer: string,
        public menu: number,
        public button: number,
    ) { }
}