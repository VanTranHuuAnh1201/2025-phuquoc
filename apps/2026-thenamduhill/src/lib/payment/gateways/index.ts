import { PaymentGateway } from './types'
import { PayOSGateway } from './payos'

export function resolveGateway(name?: string): PaymentGateway {
    const gatewayName = name || process.env.PAYMENT_GATEWAY || 'payos'
    switch (gatewayName.toLowerCase()) {
        case 'payos':
        default:
            return new PayOSGateway()
    }
}

export * from './types'
export * from './payos'
