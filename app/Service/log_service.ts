import Bull from "@ioc:Rocketseat/Bull";

export default class LogService {
    public static create(level: string, message: string) {
        Bull.add('LogJob', { level, message }, { removeOnComplete: true, removeOnFail: true })
    }
}
