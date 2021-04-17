import { MenuItemModel } from "src/app/shared/models/menu-item.model";

export class OrderRowModel {
    constructor(
        public orderId: string,
        public issueDate: string,
        public issuer: string,
        public requestedArrivalDate: string,
        public expectedArrivalDate: string,
        public batchNumber: string,
        public vialsAmount: number,
        public price: string,
        public status: string,
        public manufacturer: string,
        public menu: MenuItemModel[],
        public button: number,
    ) { }
}