import Domain from '#models/domain'
import env from '#start/env'

export default class DomainService {
  async getOrCreateFromHost(hostname: string | null): Promise<Domain | null> {
    return await Domain.findBy('label', hostname)
  }

  async getDefaultDomain(): Promise<Domain | null> {
    const defaultDomainName = env.get('APP_DOMAIN')
    return await Domain.findBy('label', defaultDomainName)
  }

  buildFullUrl(domain: Domain | null, slug: string): string {
    const domainName = domain?.label || env.get('APP_DOMAIN')
    return `https://${domainName}/${slug}`
  }

  async getDomainId(hostname: string | null): Promise<string | null> {
    const domain = await this.getOrCreateFromHost(hostname)
    return domain?.id || null
  }

  getDomainFromUrl(url: string): string {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch {
      return env.get('APP_DOMAIN')
    }
  }

  static async getAvailableDomainsForUser(userId: string): Promise<Domain[]> {
    const domains = await Domain.query()
      .whereHas('organization', (orgQuery) => {
        orgQuery.whereHas('users', (userQuery) => {
          userQuery.where('user_id', userId)
        })
      })
      .where('is_active', true)
      .preload('organization')

    return domains
  }

  static async createDomain(data: {
    name: string
    description?: string
    label: string
    organizationId: string
  }): Promise<Domain> {
    const domain = await Domain.create({
      name: data.name,
      description: data.description,
      label: data.label.toLowerCase(),
      organizationId: data.organizationId,
      isActive: true,
    })

    return domain
  }

  static async validateDomainAccess(domainId: string, userId: string): Promise<boolean> {
    const domain = await Domain.query()
      .where('id', domainId)
      .whereHas('organization', (orgQuery) => {
        orgQuery.whereHas('users', (userQuery) => {
          userQuery.where('user_id', userId)
        })
      })
      .first()

    return !!domain
  }

  static async isLabelAvailable(label: string, excludeId?: string): Promise<boolean> {
    const query = Domain.query().where('label', label.toLowerCase())

    if (excludeId) {
      query.whereNot('id', excludeId)
    }

    const existingDomain = await query.first()
    return !existingDomain
  }

  static async getOrganizationDomains(organizationId: string): Promise<Domain[]> {
    return Domain.query()
      .where('organization_id', organizationId)
      .where('is_active', true)
      .orderBy('created_at', 'desc')
  }

  static async toggleDomainStatus(domainId: string): Promise<Domain> {
    const domain = await Domain.findOrFail(domainId)
    domain.isActive = !domain.isActive
    await domain.save()
    return domain
  }
}
