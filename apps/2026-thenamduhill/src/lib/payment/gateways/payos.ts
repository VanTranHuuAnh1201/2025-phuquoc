import { PaymentGateway, GatewayEvent } from './types'

export class PayOSGateway implements PaymentGateway {
    readonly name = 'payos'

    extractSignature(req: Request, rawBody: string): string | null {
        const headerSig = req.headers.get('x-payos-signature') || req.headers.get('x-signature')
        if (headerSig) return headerSig

        try {
            const body = JSON.parse(rawBody)
            return body.signature || body.data?.signature || null
        } catch {
            return null
        }
    }

    signingPayload(rawBody: string): string {
        try {
            const parsed = JSON.parse(rawBody)
            const dataObj = parsed.data || parsed

            if (!dataObj || typeof dataObj !== 'object') {
                return rawBody
            }

            const sortedKeys = Object.keys(dataObj).sort()
            const parts: string[] = []

            for (const key of sortedKeys) {
                if (key === 'signature') continue
                const val = dataObj[key]
                if (val !== null && val !== undefined && typeof val !== 'object') {
                    parts.push(`${key}=${val}`)
                }
            }

            return parts.join('&')
        } catch {
            return rawBody
        }
    }

    parse(rawBody: string): GatewayEvent {
        const body = JSON.parse(rawBody)
        const data = body.data || body

        return {
            gatewayTxnId: String(data.orderCode || data.reference || data.paymentLinkId || Date.now()),
            bookingCode: String(data.description || data.orderCode || ''),
            amount: Number(data.amount || 0),
            occurredAt: data.transactionDateTime || new Date().toISOString(),
            status: data.code === '00' || data.success ? 'succeeded' : 'failed'
        }
    }
}
