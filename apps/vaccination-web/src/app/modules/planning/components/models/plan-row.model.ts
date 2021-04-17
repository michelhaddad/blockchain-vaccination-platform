export class PlanRowModel {
    constructor(
        public orderId: string,
        public deliveryId: string,
        public issueDate: string,
        public storageFacility: string,
        public hospital: string,
        public batchNumber: string,
        public vialQuantity: number,
        public status: string,
        public button: number,
    ) { }
}