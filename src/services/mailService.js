import "dotenv/config";
import nodemailer from 'nodemailer'

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        })
    }

        async sendActivationMail(to, link) {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: 'Activating account in Exam Platform',
                text: '',
                html: `
                <div>
                <h1>Welcome!</h1>
                <p>Follow the link bellow to activate the account: </p>
                <a href="${link}">${link}</a>
                </div>
                `
            })
        }
}
const mailService = new MailService()
export default mailService