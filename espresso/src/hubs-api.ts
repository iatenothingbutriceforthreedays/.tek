import { addMonths, subSeconds, getUnixTime } from 'date-fns'
import { v4 as uuidv4 } from 'uuid';
import { sign } from 'jsonwebtoken'
import fetch from 'node-fetch'

export interface User {
  email: string
}

interface Token {
  aud: string
  iss: string
  exp: number
  iat: number
  nbf: number
  jti: string
  sub: string
  typ: string
}

export const dr33mApiClient = (
  admin_id: string,
  secret: string,
  apiBase: string = 'https://dr33mphaz3r.net/api/v1'
) => {

  const createJWT = () => {
    const issuedAt = new Date()
    const expireAt = addMonths(issuedAt, 12)
    const notBefore = subSeconds(issuedAt, 1)

    const payload: Token = {
      aud: 'ret',
      iss: 'ret',
      exp: getUnixTime(expireAt),
      iat: getUnixTime(issuedAt),
      nbf: getUnixTime(notBefore),
      jti: uuidv4(),
      sub: admin_id,
      typ: 'access',
    }

    return sign(payload, secret, { algorithm: 'HS512' })
  }

  const authHeader = { 'Authorization': `Bearer ${createJWT()}` }

  // `null` if not present
  const lookup = async (email: string) => {
    const res = await fetch(`${apiBase}/accounts/search`, {
      method: 'POST',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });

    if (!res.ok) {
      console.error(`dr33m error: ${await res.text()}`)
      return null
    }

    const data = await res.json()

    const { data: [{ id }] } = data

    return { email, id }
  }

  const createAccount = async ({ email }: User) => {
    const res = await fetch(`${apiBase}/accounts`, {
      method: 'POST',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { email } })
    });

    return res.ok ? lookup(email) : null
  }

  return {
    createAccount,
    lookup
  }
}

/*
const updateAccount = async (email : string, name : string) => {
  const res = await fetch(`${HUBS_API_BASE}/accounts`, {
    method: 'PATCH',
    headers: { ...HUBS_AUTH_HEADER, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: {email, name} })
  });

  if (!res.ok) return null

  const data = await res.json()

  const { data: { id }} = data

  return {email, name, id}
}
*/
