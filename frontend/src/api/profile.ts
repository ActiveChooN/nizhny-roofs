import {authFetch} from '../authProvider';

export const getProfile = (): Promise<any> => (
    authFetch('/profile').then(async r => {
        if (r.ok) {
            return await r.json();
        } else {
            throw await r.json();
        }
    })
);

export const postAvatar = (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('avatar', file);

    return authFetch('/profile/avatar', {
        method: 'POST',
        body: formData,
    })
}

export const patchProfile = (email?: string, firstName?: string, lastName?: string): Promise<any> => (
     authFetch('/profile', {
         method: 'PATCH',
         body: JSON.stringify({
            'email': email,
            'first_name': firstName,
            'last_name': lastName,
        }, null, '\t')
     }).then(async r => {
        if (r.status !== 200) {
            throw await r.json();
        } else {
            return await r.json();
        }
    })
)