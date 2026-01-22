import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import LinkService from '#services/link_service'
import vine from '@vinejs/vine'

const createLinkValidator = vine.compile(
  vine.object({
    targetUrl: vine.string().url(),
    slugCustom: vine.string().minLength(3).maxLength(50).optional(),
    label: vine.string().maxLength(100).optional(),
    category: vine.string().maxLength(50).optional(),
  })
)

const updateLinkValidator = vine.compile(
  vine.object({
    targetUrl: vine.string().url().optional(),
    slugCustom: vine.string().minLength(3).maxLength(50).optional().nullable(),
    label: vine.string().maxLength(100).optional().nullable(),
    category: vine.string().maxLength(50).optional().nullable(),
  })
)

@inject()
export default class LinksController {
  constructor(protected linkService: LinkService) {}

  public async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.linkService.index(user.id)
  }

  public async store({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createLinkValidator)
    return this.linkService.store({
      userId: user.id,
      ...payload,
    })
  }

  public async show({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.linkService.show(params.id, user.id)
  }

  public async update({ auth, params, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateLinkValidator)
    return this.linkService.update(params.id, user.id, payload)
  }

  public async destroy({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.linkService.destroy(params.id, user.id)
  }
}