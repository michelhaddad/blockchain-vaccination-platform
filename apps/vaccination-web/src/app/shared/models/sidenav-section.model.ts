export class SidenavSection {
    constructor(
        public mainSection: Section,
        public hasSubSections: boolean,
        public icon: string,
        public organizations: number[],
        public subSections?: Section[]

    ) { }
}


export class Section {
    constructor(
        public title: string,
        public link: string,
    ) { }
}
