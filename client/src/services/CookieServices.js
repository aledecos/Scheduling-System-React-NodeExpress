//Cookie Service
import Cookies from 'universal-cookie';

class CookieService{
    constructor(){
        this.cookie = new Cookies();
    }
    
    get(key){
        return this.cookie.get(key);
    }

    async set(key, value, options){
        await this.cookie.set(key, value, options);
    }

    async remove(key, options){
        await this.cookie.remove(key,options);
    }
}

export default new CookieService();