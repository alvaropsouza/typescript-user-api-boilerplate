import sgMail from '@sendgrid/mail'
import envs from '@config/envs'

const { apiKey, templateIds, sender } = envs.email

sgMail.setApiKey(apiKey)

import logger from '@config/logger'

export class Mailer {
    public async sendConfirmationEmail({ email, name, token }) {
        try {
            const msg = {
                to: email,
                from: sender,
                subject: 'Sending with Twilio SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: '<div></div>',
                template_id: templateIds.confirmEmail,
                personalizations: [
                    {
                        to: { email },
                        dynamic_template_data: {
                            subject: `Hello ${name}! Confirm your email on Growers Buddy`,
                            recipient_name: name,
                            token,
                            name,
                            email
                        }
                    }
                ]
            }

            await sgMail.send(msg)
            logger.info('email sent')
        } catch (error: any) {
            throw new Error(error)
        }
    }
}
