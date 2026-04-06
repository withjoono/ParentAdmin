import { config } from './config';
import { clearTokens, getAccessToken as geobukGetAccessToken, hasAccessToken, setTokens } from 'geobuk-shared/auth';

const HUB_URL = config.hubUrl;
const HUB_API_URL = config.hubApiUrl;
const SERVICE_ID = 'parentadmin';

export function redirectToLogin() {
    const currentUrl = window.location.href;
    window.location.href = `${HUB_URL}/auth/login?redirect=${encodeURIComponent(currentUrl)}`;
}

export function logout() {
    clearTokens();
    window.location.reload();
}

export function isLoggedIn(): boolean {
    return hasAccessToken();
}

export function getAccessToken(): string | null {
    return geobukGetAccessToken();
}

/**
 * SSO 코드를 Hub Backend에 직접 전송하여 토큰 교환
 * (별도 백엔드 없으므로 Hub API를 직접 호출)
 */
export async function processSSOLogin(): Promise<boolean> {
    const params = new URLSearchParams(window.location.search);
    const ssoCode = params.get('sso_code');

    if (!ssoCode) return false;

    try {
        const response = await fetch(`${HUB_API_URL}/auth/sso/verify-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: ssoCode, serviceId: SERVICE_ID }),
        });

        if (!response.ok) return false;

        const result = await response.json();
        const data = result.data || result;

        if (data.accessToken) {
            setTokens(data.accessToken, data.refreshToken || '');

            // Clean up URL
            const url = new URL(window.location.href);
            url.searchParams.delete('sso_code');
            window.history.replaceState({}, '', url.toString());
            return true;
        }
    } catch (e) {
        console.warn('[SSO] Exchange failed:', e);
    }

    return false;
}
