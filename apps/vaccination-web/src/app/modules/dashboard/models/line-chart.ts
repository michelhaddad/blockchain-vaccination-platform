export class LineModel {
    constructor(
        public name: string,
        public series: PointModel[],
    ) { }
}

export class PointModel {
    constructor(
        public name: string,
        public value: any
    ) { }
}