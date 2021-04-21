const orders = [
    {
        orderID: '8a2537b8-694f-4cf9-a86f-2aa95cadb101',
        date: '2021-04-31',
        vialsAmount: '5000',
        state: 1,
        requestedArrivalDate: '2021-07-02'
    },
    {
        orderID: '54ea395a-5159-4c15-aa70-429b88809027',
        date: '2021-05-02',
        vialsAmount: '4000',
        state: 1,
        requestedArrivalDate: '2021-07-06'
    },
    {
        orderID: '6ea9e475-7ea4-4f58-8a0c-f3b80e55f49e',
        date: '2021-05-05',
        vialsAmount: '8000',
        state: 2,
        batchNumber: 'BATCH006',
        expectedDeliveryDate: '2021-07-09',
        fee: '5000',
        requestedArrivalDate: '2021-07-09'
    },
    {
        orderID: '1650b0d6-be81-465f-a8cc-7b69eb4ba9e2',
        date: '2021-05-08',
        vialsAmount: '6000',
        state: 2,
        batchNumber: 'BATCH005',
        expectedDeliveryDate: '2021-07-26',
        fee: '4000',
        requestedArrivalDate: '2021-07-20'
    },
    {
        orderID: '17c4569a-405d-482e-aea6-115f5a3f968b',
        date: '2021-05-15',
        vialsAmount: '7000',
        state: 3,
        batchNumber: 'BATCH004',
        expectedDeliveryDate: '2021-07-30',
        fee: '10000',
        requestedArrivalDate: '2021-07-28'
    },
    {
        orderID: 'a00dfde0-653d-4961-a268-fff4660e5204',
        date: '2021-05-20',
        vialsAmount: '2000',
        state: 4,
        batchNumber: 'BATCH002',
        expectedDeliveryDate: '2021-08-09',
        fee: '4000',
        requestedArrivalDate: '2021-08-01',
        deliveryDate: '2021-08-09'
    },
    {
        orderID: 'c2a847f5-06ae-4e6e-b3ba-113b93d5bc8e',
        date: '2021-05-28',
        vialsAmount: '3500',
        state: 4,
        batchNumber: 'BATCH001',
        expectedDeliveryDate: '2021-08-09',
        fee: '3000',
        requestedArrivalDate: '2021-08-08',
        deliveryDate: '2021-08-12'
    },
];

module.exports = orders;