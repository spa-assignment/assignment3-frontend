import Router from './Router'
import { routes } from './routes'
import Auth from './Auth'
import Toast from './Toast'

class App {

    /**
     * Constructor
     */
    constructor() {
        this.name = 'Dog Care'
        this.version = '1.0.0'
        this.rootEl = document.querySelector('#root')
    }

    /**
     * Initialise the app.
     */
    init() {
        // Toast init
        Toast.init()  
        this.checkToken()
    }

    async checkToken() {
        // Authenticate acces token and initialise Router
        const response = await Auth.check() 

        if (response.error) {
            Toast.notify(response.error.message, 'error')
        }  
        
        Router.init(routes) 
    }
}

// Export an instance of the App
export default new App()