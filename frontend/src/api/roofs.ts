import {authFetch} from '../authProvider';

export const getRoofs = ():Promise<any> => (
    authFetch('/roofs').then(async r => {
        if (r.ok) {
            return await r.json();
        } else {
            throw await r.json();
        }
    })
);