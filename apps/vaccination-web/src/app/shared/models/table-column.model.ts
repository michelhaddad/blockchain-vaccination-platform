import { MenuItemModel } from "./menu-item";

export class TableColumnModel {
    constructor(
        public id: string,
        public title: string,
        public clickable: boolean = false,
        public isStatus: boolean = false,
        public isButton: boolean = false,
        // public isMenu: boolean = false,
        // public menuItems: MenuItemModel[] = []
    ) { }
}
