import { MenuItemModel } from "./menu-item.model";

export class TableColumnModel {
    constructor(
        public id: string,
        public title: string,
        public clickable: boolean = false,
        public isButton: boolean = false,
        public isMenuButton: boolean = false,
        public menuItems?: MenuItemModel[]
    ) { }
}
