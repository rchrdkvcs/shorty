import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import QrCodeService from '#services/qr_code_service'
import vine from '@vinejs/vine'

const createQrCodeValidator = vine.compile(
  vine.object({
    linkId: vine.string(),
    name: vine.string().minLength(1).maxLength(100),
    foregroundColor: vine.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    backgroundColor: vine.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    logoUrl: vine.string().url().optional().nullable(),
    size: vine.number().min(100).max(1000).optional(),
    errorCorrectionLevel: vine.enum(['L', 'M', 'Q', 'H']).optional(),
    logoSize: vine.number().min(10).max(200).optional().nullable(),
    roundedCorners: vine.boolean().optional(),
  })
)

const updateQrCodeValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(100).optional(),
    foregroundColor: vine.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    backgroundColor: vine.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    logoUrl: vine.string().url().optional().nullable(),
    size: vine.number().min(100).max(1000).optional(),
    errorCorrectionLevel: vine.enum(['L', 'M', 'Q', 'H']).optional(),
    logoSize: vine.number().min(10).max(200).optional().nullable(),
    roundedCorners: vine.boolean().optional(),
  })
)

@inject()
export default class QrCodesController {
  constructor(protected qrCodeService: QrCodeService) {}

  public async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.qrCodeService.index(user.id)
  }

  public async store({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createQrCodeValidator)
    return this.qrCodeService.store({
      userId: user.id,
      ...payload,
    })
  }

  public async show({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.qrCodeService.show(params.id, user.id)
  }

  public async update({ auth, params, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateQrCodeValidator)
    return this.qrCodeService.update(params.id, user.id, payload)
  }

  public async destroy({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.qrCodeService.destroy(params.id, user.id)
  }

  public async getByLinkId({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.qrCodeService.getByLinkId(params.linkId, user.id)
  }
}
