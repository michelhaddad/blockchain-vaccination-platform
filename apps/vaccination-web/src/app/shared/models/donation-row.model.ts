export class DonationRowModel {
    constructor(
        public donationId: string,
        public amount: string,
        public date: string,
        public issuer: string,
        public button: number
        ) { }
}
