// Export the Router
class Router {

    /**
     * Constructor
     */
    constructor() {
        this.routes = []
        this.currentRoute = null
    }

    /**
     * Initialise the Router
     * 
     * @param {Array} routes 
     */
    init(routes) {
        this.routes = routes

        // initial call
        this.routeTo(window.location.pathname)

        // on back/forward
        window.addEventListener('popstate', () => this.routeTo(window.location.pathname))
    }

    /**
     * Programmatically load any route
     * 
     * @param {string} pathname The pathname
     */
    routeTo(pathname) {
        // extract path without params
        const pathnameNoParams = pathname.split('?')[0]
        let route = this.routes.find(r => r.path === pathnameNoParams)
        // check if route exists
        if (!route) {
            // if route does not exist, use the the fallback route
            route = this.routes.find(r => r.path === '**')
            route.view.init()
            return
        }

        let checkRoute = {
            authorized: true,
            redirectTo: ''
        }

        // check route if route can be accessed 
        if (route.fnCheckRoute && typeof (route.fnCheckRoute) === 'function') {
            checkRoute = route.fnCheckRoute()
        }

        if (checkRoute.authorized) {
            this.currentRoute = route
            route.view.init()
        } else {
            // if route cannot be accessed then stay on same route (current route) otherwise 
            // set current route to the redirected route
            if (!this.currentRoute) {
                this.currentRoute = this.routes.find(r => r.path === checkRoute.redirectTo)
                this.currentRoute.view.init()
            }
            window.history.pushState({}, pathnameNoParams, window.location.origin + this.currentRoute.path)
        }
    }

    /**
     * Programmatically load any route
     * 
     * @param {string} pathname 
     */
    goToRoute(pathname) {
        window.history.pushState({}, pathname, window.location.origin + pathname)
        this.routeTo(pathname)
    }
}

// export an instance of the Router
const AppRouter = new Router()
export default AppRouter

/**
 * Programmatically load any route
 * 
 * @param {string} pathname The pathname
 */
export function goToRoute(pathname) {
    AppRouter.goToRoute(pathname)
}

/**
 * Allow anchor <a> links to load routes
 * 
 * @param {any} e Event
 */
export function anchorRoute(e) {
    e.preventDefault()
    const pathname = e.target.closest('a').pathname
    AppRouter.goToRoute(pathname)
}