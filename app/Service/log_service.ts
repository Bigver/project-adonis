import Log from 'App/Models/Log'

export default class LogService {
    public static async create(level: string, message: string, context: any) {
        await Log.create({
            level,
            message,
            context: JSON.stringify(context),
        })
    }

}


