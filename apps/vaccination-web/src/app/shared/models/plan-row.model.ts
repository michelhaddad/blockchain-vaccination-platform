export class PlanRowModel {
    constructor(
        public orderId: string,
        public date: string,
        public storageFacility: string,
        public hospital: string,
        public batchNumber: string,
        public vialQuantity: number,
        public status: number,
        public button: number,
    ) { }
}
