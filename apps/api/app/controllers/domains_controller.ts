import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import DomainService from '#services/domain_service'
import vine from '@vinejs/vine'

const createDomainValidator = vine.compile(
  vine.object({
    domain: vine.string().minLength(3).maxLength(255),
  })
)

const updateDomainValidator = vine.compile(
  vine.object({
    domain: vine.string().minLength(3).maxLength(255).optional(),
  })
)

@inject()
export default class DomainsController {
  constructor(protected domainService: DomainService) {}

  public async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.domainService.index(user.id)
  }

  public async store({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createDomainValidator)
    return this.domainService.store({
      userId: user.id,
      ...payload,
    })
  }

  public async show({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.domainService.show(params.id, user.id)
  }

  public async update({ auth, params, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateDomainValidator)
    return this.domainService.update(params.id, user.id, payload)
  }

  public async destroy({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.domainService.destroy(params.id, user.id)
  }

  public async verify({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.domainService.verify(params.id, user.id)
  }

  public async verified({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    return this.domainService.getVerifiedDomains(user.id)
  }
}
