export class PlanRowModel {
    constructor(
        public orderId: string,
        public deliveryId: string,
        public date: string,
        public storageFacility: string,
        public hospital: string,
        public batchNumber: string,
        public vialsQuantity: number,
        public status: string,
        public button: number,
    ) { }
}