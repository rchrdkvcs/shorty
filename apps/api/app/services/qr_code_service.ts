import QrCode from '#models/qr_code'
import Link from '#models/link'

interface CreateQrCodePayload {
  userId: string
  linkId: string
  name: string
  foregroundColor?: string
  backgroundColor?: string
  logoUrl?: string | null
  size?: number
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  logoSize?: number | null
  roundedCorners?: boolean
}

interface UpdateQrCodePayload {
  name?: string
  foregroundColor?: string
  backgroundColor?: string
  logoUrl?: string | null
  size?: number
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  logoSize?: number | null
  roundedCorners?: boolean
}

export default class QrCodeService {
  public async index(userId: string) {
    return QrCode.query()
      .where('userId', userId)
      .preload('link', (linkQuery) => {
        linkQuery.preload('domain')
      })
      .orderBy('createdAt', 'desc')
  }

  public async show(id: string, userId: string) {
    return QrCode.query()
      .where('id', id)
      .where('userId', userId)
      .preload('link', (linkQuery) => {
        linkQuery.preload('domain')
      })
      .firstOrFail()
  }

  public async store(payload: CreateQrCodePayload) {
    // Validate that the link exists and belongs to the user
    await this.validateLinkOwnership(payload.linkId, payload.userId)

    const qrCode = await QrCode.create({
      userId: payload.userId,
      linkId: payload.linkId,
      name: payload.name,
      foregroundColor: payload.foregroundColor || '#000000',
      backgroundColor: payload.backgroundColor || '#ffffff',
      logoUrl: payload.logoUrl || null,
      size: payload.size || 300,
      errorCorrectionLevel: payload.errorCorrectionLevel || 'M',
      logoSize: payload.logoSize || null,
      roundedCorners: payload.roundedCorners || false,
    })

    await qrCode.load('link', (linkQuery) => {
      linkQuery.preload('domain')
    })
    return qrCode
  }

  public async update(id: string, userId: string, payload: UpdateQrCodePayload) {
    const qrCode = await this.show(id, userId)

    qrCode.merge(payload)
    await qrCode.save()
    await qrCode.load('link', (linkQuery) => {
      linkQuery.preload('domain')
    })
    return qrCode
  }

  public async destroy(id: string, userId: string) {
    const qrCode = await this.show(id, userId)
    await qrCode.delete()
    return { message: 'QR code deleted successfully' }
  }

  public async getByLinkId(linkId: string, userId: string) {
    return QrCode.query()
      .where('linkId', linkId)
      .where('userId', userId)
      .preload('link', (linkQuery) => {
        linkQuery.preload('domain')
      })
      .orderBy('createdAt', 'desc')
  }

  private async validateLinkOwnership(linkId: string, userId: string) {
    const link = await Link.query().where('id', linkId).where('userId', userId).first()

    if (!link) {
      throw new Error('Link not found or does not belong to you')
    }

    return link
  }
}
