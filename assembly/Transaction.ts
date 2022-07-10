@nearBindgen
export class Transaction{
  sender : string
  Type : string
  Drugname: string
  Amount : i32
  constructor(sender: string ,Type: string ,Drugname: string ,Amount: i32) {
    this.sender = sender;
    this.Type = Type;
    this.Drugname = Drugname;
    this.Amount = Amount;
  }
}