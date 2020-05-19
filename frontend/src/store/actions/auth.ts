import {login as APILogin} from "../../api/auth";
import {login as loginProvider} from "../../authProvider";

export const login = (email: string, password: string): Promise<any> =>
    APILogin(email, password).then(r => {
        loginProvider(r);
        return r;
    });