'use server'

export async function sendContactEmail(formData: {
  name: string
  email: string
  message: string
}) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log('Contact form submission:', formData)
    return { success: true, message: 'Message received (dev mode)' }
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'hello@example.com',
      subject: `Portfolio Contact: ${formData.name}`,
      text: `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
    })

    return { success: true, message: 'Message sent successfully!' }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, message: 'Failed to send message. Please try again.' }
  }
}
