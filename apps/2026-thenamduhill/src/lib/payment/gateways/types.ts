export interface GatewayEvent {
    gatewayTxnId: string
    bookingCode: string
    amount: number
    occurredAt: string
    status: 'succeeded' | 'failed' | 'pending'
}

export interface PaymentGateway {
    readonly name: string
    extractSignature(req: Request, rawBody: string): string | null
    signingPayload(rawBody: string): string
    parse(rawBody: string): GatewayEvent
}
