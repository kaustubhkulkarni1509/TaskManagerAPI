const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to:email,
        from:'kaustubhkulkarni150994@gmail.com',
        subject:'Welcome to the task application',
        text:`Welcome to the app, ${name}. Let me know how to find it. `
    })
}

module.exports = {sendWelcomeEmail}