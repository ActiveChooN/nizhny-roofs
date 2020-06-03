import {createAuthProvider} from 'react-token-auth';

export const baseURL = process.env.REACT_APP_API_URL || '/api/v1'

export const fetchInstance = (input: RequestInfo, init?: RequestInit | undefined): Promise<Response> =>
    typeof input === 'string' ? fetch(baseURL + input, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers,
        },
    }) : fetch({
        ...input,
        url: baseURL + input.url,
    }, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers,
        },
    })

export const [useAuth, authFetch, login, logout] =
    createAuthProvider<{ access_token: string, refresh_token: string }>({
        accessTokenKey: 'access_token',
        customFetch: fetchInstance,
        onUpdateToken: (token) => fetchInstance('/token/refresh', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token.refresh_token}`
            }
        })
        .then(r => r.json())
        .then(r => ({
            access_token: r.access_token,
            refresh_token: token.refresh_token,
        })),
    });


