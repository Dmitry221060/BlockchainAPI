export class EVMTransactionDto {
  hash!: string;
  to!: string | null;
  from!: string;
  value!: string;
  input!: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  gasPrice!: string;
}
