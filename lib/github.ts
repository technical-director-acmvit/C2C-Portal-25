import crypto from 'node:crypto';

const GITHUB_API = 'https://api.github.com';

function normalizePem(pem: string): string {
  let s = pem.trim();
  if (s.includes('\\n')) s = s.replace(/\\n/g, '\n');
  s = s.replace(/\r\n/g, '\n');
  return s;
}

function getAppConfig() {
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
  if (!appId) throw new Error('Missing GITHUB_APP_ID');
  if (!privateKey) throw new Error('Missing GITHUB_APP_PRIVATE_KEY');
  let key = normalizePem(privateKey);
  if (!key.includes('-----BEGIN')) {
    try { key = normalizePem(Buffer.from(privateKey, 'base64').toString('utf8')); } catch {}
  }
  if (/-----BEGIN RSA PRIVATE KEY-----/.test(key)) {
    try { key = pkcs1ToPkcs8(key); } catch { /* ignore */ }
  }
  return { appId, privateKey: key };
}

export function getInstallUrl(redirectUrl?: string, state?: string): string {
  const slug = process.env.NEXT_PUBLIC_GH_APP_SLUG;
  if (!slug) throw new Error('Missing NEXT_PUBLIC_GH_APP_SLUG');
  const base = `https://github.com/apps/${encodeURIComponent(slug)}/installations/new`;
  const params = new URLSearchParams();
  if (redirectUrl) params.set('redirect_url', redirectUrl);
  if (state) params.set('state', state);
  const s = params.toString();
  return s ? `${base}?${s}` : base;
}

function base64url(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function createAppJwt(): string {
  const { appId, privateKey } = getAppConfig();
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60,
    exp: now + 9 * 60,
    iss: appId,
  } as const;
  const header = { alg: 'RS256', typ: 'JWT' } as const;
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  try {
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(data);
    const keyObj = crypto.createPrivateKey({ key: privateKey, format: 'pem' });
    const signature = signer.sign(keyObj);
    const encodedSignature = base64url(signature);
    return `${data}.${encodedSignature}`;
  } catch (_) {
    const der = pemToPkcs8Der(privateKey);
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(data);
    const keyObj = crypto.createPrivateKey({ key: der, format: 'der', type: 'pkcs8' });
    const signature = signer.sign(keyObj);
    const encodedSignature = base64url(signature);
    return `${data}.${encodedSignature}`;
  }
}

function derLen(len: number): Buffer {
  if (len < 0x80) return Buffer.from([len]);
  const bytes: number[] = [];
  let n = len;
  while (n > 0) { bytes.unshift(n & 0xff); n >>= 8; }
  return Buffer.from([0x80 | bytes.length, ...bytes]);
}

function asn1Seq(content: Buffer): Buffer {
  return Buffer.concat([Buffer.from([0x30]), derLen(content.length), content]);
}
function asn1IntZero(): Buffer { return Buffer.from([0x02, 0x01, 0x00]); }
function asn1Null(): Buffer { return Buffer.from([0x05, 0x00]); }
function asn1OidRsaEncryption(): Buffer { return Buffer.from([0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01]); }
function asn1OctetString(data: Buffer): Buffer { return Buffer.concat([Buffer.from([0x04]), derLen(data.length), data]); }

function extractPemBody(pem: string): Buffer {
  const body = pem.replace(/-----BEGIN [^-]+-----/g, '').replace(/-----END [^-]+-----/g, '').replace(/\s+/g, '');
  return Buffer.from(body, 'base64');
}

function toPem(label: string, der: Buffer): string {
  const b64 = der.toString('base64').replace(/(.{64})/g, '$1\n');
  return `-----BEGIN ${label}-----\n${b64}\n-----END ${label}-----`;
}

function pkcs1ToPkcs8(pkcs1Pem: string): string {
  const pkcs1Der = extractPemBody(pkcs1Pem);
  const version = asn1IntZero();
  const algId = asn1Seq(Buffer.concat([asn1OidRsaEncryption(), asn1Null()]));
  const privateKey = asn1OctetString(pkcs1Der);
  const pkcs8 = asn1Seq(Buffer.concat([version, algId, privateKey]));
  return toPem('PRIVATE KEY', pkcs8);
}

function pemToPkcs8Der(pem: string): Buffer {
  if (/-----BEGIN PRIVATE KEY-----/.test(pem)) {
    return extractPemBody(pem);
  }
  if (/-----BEGIN RSA PRIVATE KEY-----/.test(pem)) {
    const pkcs1Der = extractPemBody(pem);
    const version = asn1IntZero();
    const algId = asn1Seq(Buffer.concat([asn1OidRsaEncryption(), asn1Null()]));
    const privateKey = asn1OctetString(pkcs1Der);
    const pkcs8 = asn1Seq(Buffer.concat([version, algId, privateKey]));
    return pkcs8;
  }
  throw new Error('Unsupported PEM format');
}

export async function fetchInstallationToken(installationId: string): Promise<string> {
  const jwt = createAppJwt();
  const url = `${GITHUB_API}/app/installations/${installationId}/access_tokens`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'c2c-app',
    },
    // body can be empty; scope to all repos granted by installation
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create installation token: ${res.status} ${text}`);
  }
  const json = await res.json() as { token: string };
  if (!json?.token) throw new Error('No token in response');
  return json.token;
}

async function gh<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'c2c-app',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function listInstallationRepos(installationId: string) {
  const token = await fetchInstallationToken(installationId);
  const data = await gh<{ repositories: Array<{ id: number; name: string; full_name: string; private: boolean; owner: { login: string }; html_url: string; }>; }>(`/installation/repositories`, token);
  return data.repositories;
}

export async function listCommits(installationId: string, owner: string, repo: string) {
  const token = await fetchInstallationToken(installationId);
  type Commit = { sha: string; html_url: string; commit: { message: string; author?: { name?: string; date?: string } }; author?: { login?: string; avatar_url?: string } };
  return gh<Commit[]>(`/repos/${owner}/${repo}/commits`, token);
}

export async function getContents(installationId: string, owner: string, repo: string, path = '') {
  const token = await fetchInstallationToken(installationId);
  return gh<any>(`/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, token);
}
