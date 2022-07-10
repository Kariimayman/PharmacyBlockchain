import { Context , PersistentVector} from "near-sdk-as"
import { Transaction } from "./Transaction"
@nearBindgen
export class Pharmacy {
  Transactions : PersistentVector<Transaction> = new PersistentVector<Transaction>("T")
  DrugsName : PersistentVector<string> = new PersistentVector<string>("D")
  Quantity : PersistentVector<i32> = new PersistentVector<i32>("Q")

  @mutateState()
  AddDrug(Name : string , amount : i32): string 
  {
    let sender:string = Context.sender
    let flag : bool = true
    for(let i: i32 = 0; i < this.DrugsName.length; i++)
    {
      if(this.DrugsName[i] == Name)
      {
        this.Quantity[i] = this.Quantity[i] + amount
        
        flag = false
      }
    }
    if(flag) 
    {
      this.DrugsName.push(Name)
      this.Quantity.push(amount)
    } 
    let Move : Transaction = new Transaction(sender,"AddDrug",Name,amount)
    this.Transactions.push(Move)
    return ("Added Successfully")
  }
  @mutateState()
  RemoveDrug(Name : string , amount : i32) : string
  {
    let sender:string = Context.sender
    for(let i: i32 = 0; i < this.DrugsName.length; i++)
    {
      if(this.DrugsName[i] == Name)
      { 
        if (this.Quantity[i] < amount)
        {
          return("insufficient amount")
        }
        else
        {
          this.Quantity[i] = this.Quantity[i] - amount
          let Move : Transaction = new Transaction(sender,"ConsumeDrug",Name,amount)
          this.Transactions.push(Move)
          return("Completed Successfully")
        }
      }
    }
    return("Item not found") 
  }
  TransactionHistory() : Array<Transaction>
  {
    let List = new Array<Transaction>(this.Transactions.length)
    for(let i = 0; i < this.Transactions.length; i++)
    {
      List[i] = this.Transactions[i]
    }
    return List
  }
  ViewInventory() : Array<string>
  {
    let counter : i32= 0
    let List = new Array<string>(0)
    for(let i = 0; i < this.DrugsName.length; i++)
    {
      if(this.Quantity[i] != 0)
      {
        List[counter] =  this.DrugsName[i]
        counter = counter + 1
      }
    }
    if (counter == 0)
    {
      List[0] = "Out Of Stock"
    }
    return List
  }
  ViewQuantity(Search : string) : i32
  {
    for(let i = 0; i < this.DrugsName.length; i++)
    {
      if(this.DrugsName[i] == Search)
      {
        return this.Quantity[i]
      }
    }
    return 0
  }
  }