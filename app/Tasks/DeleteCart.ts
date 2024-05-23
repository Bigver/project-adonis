import { BaseTask } from 'adonis5-scheduler/build/src/Scheduler/Task'
import Bull from '@ioc:Rocketseat/Bull'

export default class DeleteCart extends BaseTask {
  public static get schedule() {
    return '* */60 * * * *'
  }

  public static get useLock() {
    return false
  }

  public async handle() {
    Bull.add('DeleteCart',{data: 'schedule ทำงาน'})
  }
}
