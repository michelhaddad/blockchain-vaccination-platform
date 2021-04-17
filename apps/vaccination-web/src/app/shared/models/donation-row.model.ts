export class DonationRowModel {
    constructor(
        public donationId: string,
        public amount: string,
        public date: string,
        public donor: string,
        public button: number
        ) { }
}
