export class Transaction {
    id: number|undefined;
    name: string = "";
    symbol: string = "";
    amount: number = 0;
    buyDate: number = Date.now();
    buyPrice: number = 0;
    sellDate: number|undefined;
    sellPrice: number|undefined;
    profitLoss: number|undefined;
}