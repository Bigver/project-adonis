import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {

    public async updatePage({ view }: HttpContextContract) {
        return view.render('user/socialUpdate')
    }

    public async update({ request, auth, response }: HttpContextContract) {
        const user = auth.user
        const newPassword = request.input('password')
        const newUsername = request.input('username')

        if (user) {
            user.password = newPassword
            user.username = newUsername
            user.passwordUpdated = true

            await user.save()
            await auth.use('web').login(user)

        }

        return response.redirect().toRoute('admin.dashboard')
    }

    public async redirectToFacebook({ ally }: HttpContextContract) {
        return ally.use('facebook').redirect()
    }

    public async handleFacebookCallback({ ally, auth, response }: HttpContextContract) {
        const facebook = ally.use('facebook')

        if (facebook.accessDenied()) {
            return 'Access was denied'
        }

        if (facebook.stateMisMatch()) {
            return 'Request expired. Retry again'
        }

        if (facebook.hasError()) {
            return facebook.getError()
        }

        const facebookUser = await facebook.user()

        const user = await User.firstOrCreate({
            email: facebookUser.email ?? undefined,
        }, {
            email: facebookUser.email ?? undefined,
            password: facebookUser.id,
            loginMethod: 'facebook',
            access: '[{\"userAdmin\":\"yes\",\"checkAdmin\":\"yes\",\"pageAdmin\":\"yes\"}]'
        });

        await auth.login(user)

        if (!user.passwordUpdated) {
            return response.redirect().toRoute('social.update.page')
        }

        return response.redirect().toRoute('admin.dashboard')
    }

    public async redirectToGoogle({ ally }: HttpContextContract) {
        return ally.use('google').redirect()
    }

    public async handleGoogleCallback({ ally, auth, response }: HttpContextContract) {
        const google = ally.use('google')

        if (google.accessDenied()) {
            return 'Access was denied'
        }

        if (google.stateMisMatch()) {
            return 'Request expired. Retry again'
        }

        if (google.hasError()) {
            return google.getError()
        }

        const googleUser = await google.user()

        const user = await User.firstOrCreate({
            email: googleUser.email ?? undefined,
        }, {
            email: googleUser.email ?? undefined,
            password: googleUser.id,
            loginMethod: 'google',
            access: '[{\"userAdmin\":\"yes\",\"checkAdmin\":\"yes\",\"pageAdmin\":\"yes\"}]'
        });

        await auth.login(user)

        if (!user.passwordUpdated) {
            return response.redirect().toRoute('social.update.page')
        }

        return response.redirect().toRoute('admin.dashboard')

    }

    public async redirectToTwitter({ ally }: HttpContextContract) {
        return ally.use('twitter').redirect()
    }

    public async handleTwitterCallback({ ally, auth, response }: HttpContextContract) {
        const twitter = ally.use('twitter')

        if (twitter.accessDenied()) {
            return 'Access was denied'
        }

        if (twitter.stateMisMatch()) {
            return 'Request expired. Retry again'
        }

        if (twitter.hasError()) {
            return twitter.getError()
        }

        const twitterUser = await twitter.user()

        const user = await User.firstOrCreate({
            email: twitterUser.email ?? undefined,
        }, {
            email: twitterUser.email ?? undefined,
            password: twitterUser.id,
            loginMethod: 'twitter',
            access: '[{\"userAdmin\":\"yes\",\"checkAdmin\":\"yes\",\"pageAdmin\":\"yes\"}]'

        });

        await auth.login(user)

        if (!user.passwordUpdated) {
            return response.redirect().toRoute('social.update.page')
        }

        return response.redirect().toRoute('admin.dashboard')

    }
}
