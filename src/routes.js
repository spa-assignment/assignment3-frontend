import Auth from './Auth'
import PageNotFoundView from './views/PageNotFoundView'
import SignInView from './views/SignInView'
import SignUpView from './views/SignUpView'
import HomeView from './views/HomeView'
import AccountView from './views/AccountView'
import ServiceCheckUpView from './views/ServiceCheckUpView'
import ServiceGroomingView from './views/ServiceGroomingView'
import ServiceTrainingView from './views/ServiceTrainingView'
import AppointmentsView from './views/AppointmentsView'
import ProductsView from './views/ProductsView'
import ProductView from './views/ProductView'
import OrdersView from './views/OrdersView'
import ManageProductsView from './views/ManageProductsView'

// function to check if a route is accessible
const anyoneLoggedIn = () => ({ authorized: Auth.currentUser, redirectTo: '/signin' })
const anyoneNotLoggedIn = () => ({ authorized: !Auth.currentUser, redirectTo: '/' })
const userLoggedIn = () => ({ authorized: Auth.currentUser && Auth.currentUser.accessLevel === 2, redirectTo: '/appointments' })
const adminLoggedIn = () => ({ authorized: Auth.currentUser && Auth.currentUser.accessLevel === 1, redirectTo: '/' })
// const guide = () => ({ isAccessible: Auth.currentUser && !Auth.currentUser.lastLoginAt, redirectTo: Auth.currentUser ? '/' : '/signin' })

// define routes
export const routes = [
    { path: '/signin', view: SignInView, fnCheckRoute: anyoneNotLoggedIn },
    { path: '/signup', view: SignUpView, fnCheckRoute: anyoneNotLoggedIn },
    { path: '/', view: HomeView, fnCheckRoute: userLoggedIn },
    { path: '/account', view: AccountView, fnCheckRoute: anyoneLoggedIn },
    { path: '/services/check-up', view: ServiceCheckUpView, fnCheckRoute: userLoggedIn },
    { path: '/services/grooming', view: ServiceGroomingView, fnCheckRoute: userLoggedIn },
    { path: '/services/training', view: ServiceTrainingView, fnCheckRoute: userLoggedIn },
    { path: '/appointments', view: AppointmentsView, fnCheckRoute: anyoneLoggedIn },
    { path: '/products', view: ProductsView, fnCheckRoute: anyoneLoggedIn },
    { path: '/product', view: ProductView, fnCheckRoute: anyoneLoggedIn },
    { path: '/orders', view: OrdersView, fnCheckRoute: anyoneLoggedIn },
    { path: '/manage-products', view: ManageProductsView, fnCheckRoute: adminLoggedIn },
    // { path: '/services', view: ServicesView, fnCheckRoute: anyoneLoggedIn },
    // { path: '/appointments', view: AppointmentsView, fnCheckRoute: anyoneLoggedIn },
    // { path: '/posts', view: PostsView, fnCheckRoute: anyoneLoggedIn },
    // { path: '/reviews', view: ReviewsView, fnCheckRoute: anyoneLoggedIn },
    { path: '**', view: PageNotFoundView }
]