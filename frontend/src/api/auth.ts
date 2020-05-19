import {fetchInstance as fetch} from '../authProvider';

export const login = (email: string, password: string): Promise<any> => (
    fetch('/token', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }, null, '\t')
    })
    .then(async r => {
        if (r.status !== 201) {
            throw await r.json();
        } else {
            return await r.json();
        }
    })
);

export const register = (email: string, password: string, firstName: string,
                         lastName: string): Promise<any> => (
    fetch('/register', {
        method: 'POST',
        body: JSON.stringify({
            'email': email,
            'password': password,
            'first_name': firstName,
            'last_name': lastName,
        }, null, '\t')
    })
    .then(async r => {
        if (r.status !== 201) {
            throw await r.json();
        } else {
            return await r.json();
        }
    })
)
