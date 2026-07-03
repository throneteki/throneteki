import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import logger from '../log.js';

class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.fromAddress =
            configService.getValue('emailFrom') || 'The Iron Throne <noreply@theironthrone.net>';
        this.replyToAddress = configService.getValue('emailReplyTo');
        let awsAccessKeyId = configService.getValue('awsAccessKeyId');
        let awsSecretAccessKey = configService.getValue('awsSecretAccessKey');

        this.client = new SESv2Client({
            region: configService.getValue('awsSesRegion'),
            credentials:
                awsAccessKeyId && awsSecretAccessKey
                    ? {
                          accessKeyId: awsAccessKeyId,
                          secretAccessKey: awsSecretAccessKey
                      }
                    : undefined
        });
    }

    async sendEmail(address, subject, text) {
        try {
            await this.client.send(
                new SendEmailCommand({
                    FromEmailAddress: this.fromAddress,
                    Destination: {
                        ToAddresses: [address]
                    },
                    ReplyToAddresses: this.replyToAddress ? [this.replyToAddress] : undefined,
                    Content: {
                        Simple: {
                            Subject: {
                                Data: subject
                            },
                            Body: {
                                Text: {
                                    Data: text
                                }
                            }
                        }
                    }
                })
            );
        } catch (err) {
            logger.error('Unable to send email %s', err);
        }
    }
}

export default EmailService;
