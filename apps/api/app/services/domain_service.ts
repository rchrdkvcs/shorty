import Domain from '#models/domain'
import { randomBytes } from 'node:crypto'
import dns from 'node:dns/promises'

interface CreateDomainPayload {
  userId: string
  domain: string
}

interface UpdateDomainPayload {
  domain?: string
}

export default class DomainService {
  public async index(userId: string) {
    return Domain.query().where('userId', userId).orderBy('createdAt', 'desc')
  }

  public async show(id: string, userId: string) {
    return Domain.query().where('id', id).where('userId', userId).firstOrFail()
  }

  public async store(payload: CreateDomainPayload) {
    const normalizedDomain = this.normalizeDomain(payload.domain)
    const verificationToken = randomBytes(32).toString('hex')

    return Domain.create({
      userId: payload.userId,
      domain: normalizedDomain,
      isVerified: false,
      verificationToken,
    })
  }

  public async update(id: string, userId: string, payload: UpdateDomainPayload) {
    const domain = await this.show(id, userId)

    if (payload.domain) {
      const normalizedDomain = this.normalizeDomain(payload.domain)
      domain.domain = normalizedDomain
      domain.isVerified = false
      domain.verificationToken = randomBytes(32).toString('hex')
    }

    await domain.save()
    return domain
  }

  public async destroy(id: string, userId: string) {
    const domain = await this.show(id, userId)
    await domain.delete()
    return { message: 'Domain deleted successfully' }
  }

  public async verify(id: string, userId: string) {
    const domain = await this.show(id, userId)

    if (domain.isVerified) {
      return { verified: true, message: 'Domain is already verified' }
    }

    const isVerified = await this.checkDnsVerification(domain.domain, domain.verificationToken)

    if (isVerified) {
      domain.isVerified = true
      await domain.save()
      return { verified: true, message: 'Domain verified successfully' }
    }

    return { verified: false, message: 'DNS verification failed. Please ensure the TXT record is properly configured.' }
  }

  public async findByDomain(domainName: string) {
    const normalizedDomain = this.normalizeDomain(domainName)
    return Domain.query().where('domain', normalizedDomain).where('isVerified', true).first()
  }

  public async getVerifiedDomains(userId: string) {
    return Domain.query().where('userId', userId).where('isVerified', true).orderBy('domain', 'asc')
  }

  private normalizeDomain(domain: string): string {
    return domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '')
  }

  private async checkDnsVerification(domain: string, token: string): Promise<boolean> {
    try {
      const records = await dns.resolveTxt(`_shorty-verification.${domain}`)
      const flatRecords = records.flat()
      return flatRecords.some((record) => record === `shorty-verify=${token}`)
    } catch {
      return false
    }
  }
}
