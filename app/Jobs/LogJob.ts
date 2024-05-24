import { JobContract } from '@ioc:Rocketseat/Bull'
import Log from 'App/Models/Log'

export default class LogJob implements JobContract {
  public key = 'LogJob'

  public async handle(job) {
    const { level, message } = job.data
    await Log.create({ level, message })
  }


  public onCompleted() {
    console.groupCollapsed("END")
  }
}
