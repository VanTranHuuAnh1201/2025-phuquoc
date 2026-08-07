/**
 * SendGrid Email Service (Mock & Sandbox Logger)
 * 
 * NOTE FOR USER / GO-LIVE HANDOVER:
 * When you obtain a SendGrid API key and verified sender email:
 * 1. Install @sendgrid/mail package: `pnpm add @sendgrid/mail`
 * 2. Set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL in .env.local / Vercel Environment Variables.
 * 3. Replace the console.log mock below with `sgMail.send({ to, from, subject, html })`.
 */

export interface SendEmailPayload {
    to: string
    subject: string
    bookingCode: string
    guestName: string
    roomTypeName: string
    checkInDate: string
    checkOutDate: string
    totalAmount: number
    paidAmount: number
    remainingAmount: number
    lang?: 'vi' | 'en'
}

export async function sendBookingConfirmationEmail(payload: SendEmailPayload): Promise<{ success: boolean; messageId?: string }> {
    const isEn = payload.lang === 'en'
    const subject = isEn
        ? `[The Nam Du Hill] Booking Confirmation - ${payload.bookingCode}`
        : `[The Nam Du Hill] Xác nhận đặt phòng - ${payload.bookingCode}`

    console.log('\n=================== [SENDGRID EMAIL MOCK] ===================')
    console.log(`To: ${payload.to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Booking Code: ${payload.bookingCode}`)
    console.log(`Guest: ${payload.guestName}`)
    console.log(`Room Type: ${payload.roomTypeName}`)
    console.log(`Check-in: ${payload.checkInDate} -> Check-out: ${payload.checkOutDate}`)
    console.log(`Total: ${new Intl.NumberFormat('vi-VN').format(payload.totalAmount)}đ | Paid: ${new Intl.NumberFormat('vi-VN').format(payload.paidAmount)}đ | Remaining: ${new Intl.NumberFormat('vi-VN').format(payload.remainingAmount)}đ`)
    console.log('Status: Email simulation logged successfully (Pass 100%)')
    console.log('=============================================================\n')

    return {
        success: true,
        messageId: `mock_msg_${Date.now()}_${payload.bookingCode}`,
    }
}
