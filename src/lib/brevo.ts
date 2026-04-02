import { BrevoClient } from '@getbrevo/brevo'

// Inicializar el cliente con la API Key
const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
})

// Tipado de los parametros de sendEmail
interface SendEmailParams {
  to: string
  toName?: string
  subject: string
  html: string
}

// Funcion reutilizable para enviar emails desde cualquier parte del backend
export async function sendEmail({ to, toName, subject, html }: SendEmailParams) {
  return brevo.transactionalEmails.sendTransacEmail({
    to: [{ email: to, name: toName }],
    subject,
    htmlContent: html,
    // Remitente (debe estar verificado en Brevo)
    sender: {
      email: process.env.BREVO_SENDER_EMAIL!,
      name: process.env.BREVO_SENDER_NAME!,
    },
  })
}