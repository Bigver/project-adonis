import { JobContract } from '@ioc:Rocketseat/Bull'
import CartService from 'App/Service/cart_service'

/*
|--------------------------------------------------------------------------
| Job setup
|--------------------------------------------------------------------------
|
| This is the basic setup for creating a job, but you can override
| some settings.
|
| You can get more details by looking at the bullmq documentation.
| https://docs.bullmq.io/
*/

export default class DeleteCart implements JobContract {
  public key = 'DeleteCart'

  public async handle() {
    await CartService.deleteCart()  
  }

  public onCompleted() {
    console.groupCollapsed("END")
  }
}
