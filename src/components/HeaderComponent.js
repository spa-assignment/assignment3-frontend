import {
    html,
    LitElement,
    css,
    nothing
} from 'lit-element'
import Auth from '../Auth'
import {
    anchorRoute,
    goToRoute
} from '../Router'
import Cart from '../Cart'
import Toast from '../Toast'

/**
 * Header component
 */
class HeaderComponent extends LitElement {

    /**
     * Properties of the component
     */
    static get properties() {
        return {
            title: {
                type: String
            },
            titleLink: {
                type: String
            },
            user: {
                type: Object
            }
        }
    }

    /**
     * Styles of the component
     */
    static get styles() {
        return [
            css `
            * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
            }

            .navbar {
                padding: 1rem 1.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .navbar-container {
                top: 0;
                width: 100%;
                position: fixed;
                z-index: 100;
                background-color: rgb(254, 247, 237);
                border-bottom: 1px solid #E2E8F0;
            }

            .navbar__logo {
                font-size: 2rem;
                font-weight: 900;
                color: #3c28c0;
                font-family: 'Lobster', cursive;
            }

            .navbar__link {
                text-decoration: none;
                font-size: 1.2rem;
                font-weight: 400;
                color: #475569;
            }

            .navbar__link:hover {
                color: #482ff7;
            }

            .navbar__link--active {
                color: #482ff7;
            }

            .navbar__menu {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .navbar__menu--vertical {
                flex-direction: column;
                align-items: flex-start;
            }

            .navbar__menu-item {
                margin-left: 2.5rem;
                list-style: none;
                display: flex;
                align-items: center;
            }

            .navbar__menu-item--vertical {
                margin-left: 0;
                margin-bottom: 2rem;
            }

            .navbar__menu-item--hide {
                display: none;
            }

            .navbar__hamburger {
                font-size: 1.5rem;
                display: none;
            }

            .navbar__icon-avatar {
                --size: 1.5rem;
            }
            
            .navbar__icon {
                font-size: 1.5rem;
            }

            .navbar__icon-cart {
                font-size: 1.5rem;
            }

            .icon-text {
                display: flex;
                align-items: center;
            }
            
            .icon-text__text {
                margin-left: .5rem;
            }

            .dialog {
                color: rgb(58, 84, 180);
            }

            /* sl-dialog */
            sl-dialog::part(title) {
                font-weight: 900;
                font-size: 2rem;
                padding-bottom: unset;
            }

            /* sl-dialog::part(panel) {
                width: 50%;
            } */
            
            @media all and (max-width: 1200px) {
                .navbar__menu-item--responsive {
                    display: none;
                }

                .navbar__menu-item-account {
                    display: block;
                }

                .navbar__icon-text--responsive {
                    display: none;
                }

                .navbar__icon-text--account {
                    display: block;
                }

                .navbar__hamburger {
                    display: block
                }

                /* sl-dialog::part(panel) {
                    width: 80%;
                } */
            }

            @media all and (max-width: 768px) {
                .navbar__menu-item--responsive {
                    display: none;
                }

                .navbar__icon-text--responsive {
                    display: block;
                }

                .navbar__menu-item-cart {
                    margin-left: 1rem;
                }

                .navbar__hamburger {
                    display: block
                }

                .icon-text__text-cart {
                    display: none;
                }

                sl-dialog::part(panel) {
                    width: 100%;
                    height: 100%;
                    max-height: none;
                    max-width: none;
                }
            }`
        ]
    }

    /**
     * Constructor
     */
    constructor() {
        super()

        this.titleLink = '/'
    }

    /**
     * Render the html content of the component
     * 
     * @returns The HTML content
     */
    render() {
        return html `
        <div class="navbar-container">
            <nav class="navbar">
                <a href="${this.titleLink}" class="navbar__link" @click="${this.handleClickTitleLink}">
                    <span class="navbar__logo">
                        <!-- ${this.title ? html`${this.title}` : nothing} -->
                        Dog Care
                    </span>
                </a>
                <ul class="navbar__menu">
                    ${this.getRoutes().map(route => html`
                    <li class="navbar__menu-item navbar__menu-item--responsive ${route.account ? 'navbar__menu-item-account' : ''}">
                        ${!route.subRoutes ? html`
                        <a href="${route.path}" @click=${e => route.handleClick(e)} class="navbar__link ${route.active ? 'navbar__link--active' : ''}">
                            <div class="icon-text">
                                <sl-icon name="${route.icon}" class="navbar__icon"></sl-icon>
                                <span class="icon-text__text navbar__icon-text--responsive">
                                    ${route.displayName}
                                </span>
                            </div>
                        </a>
                        ` : html`
                        <sl-dropdown>
                            <a href="#" slot="trigger" @click=${e => e.preventDefault()} class="navbar__link ${route.active ? 'navbar__link--active' : ''}">
                                <div class="icon-text">
                                    ${route.account ? html`
                                    <sl-avatar class="navbar__icon-avatar"></sl-avatar>
                                    ` : html`
                                    <sl-icon name="${route.icon}" class="navbar__icon"></sl-icon>`}
                                    <span class="icon-text__text navbar__icon-text--responsive ${route.account ? 'navbar__icon-text--account': ''}">
                                        ${route.displayName}
                                    </span>
                                </div>
                            </a>
                            <sl-menu>
                                ${route.subRoutes.map(subRoute => html`
                                <sl-menu-item @click="${e => subRoute.handleClick(e, subRoute.path)}">${subRoute.displayName}</sl-menu-item>
                                `)}
                            </sl-menu>
                        </sl-dropdown>
                        `}
                    </li>`)}
                    ${this.user.accessLevel === 2 ? html`
                    <li class="navbar__menu-item navbar__menu-item-cart">
                        <a href="#" @click=${e => this.handleClickCartLink(e)} class="navbar__link">
                            <div class="icon-text">
                                <sl-icon name="cart" class="navbar__icon-cart"></sl-icon>
                                <span class="icon-text__text icon-text__text-cart">
                                    Cart
                                </span>
                            </div>
                        </a>
                        <sl-dialog label="Cart" class="dialog">
                            <dc-cart .user=${this.user} .cart="${Cart.cart}" @viewproduct=${e => this.handleViewProduct()}></dc-cart>
                        </sl-dialog>
                    </li>
                    ` : 
                    nothing}
                    <li class="navbar__menu-item navbar__menu-item-cart">
                        <sl-icon-button name="list" label="Menu" class="navbar__hamburger"  @click="${this.handleHamburgerClick}"></sl-icon-button>
                    </li>
                </ul>
            </nav>
            <sl-drawer class="navbar__sidebar">
                <ul class="navbar__menu navbar__menu--vertical">
                    ${this.getRoutes().map(route => html`
                    <li class="navbar__menu-item navbar__menu-item--vertical">
                        ${!route.subRoutes ? html`
                        <a href="${route.path}" @click=${e => this.handleMenuClick(e)} class="navbar__link ${route.active ? 'navbar__link--active' : ''}">
                            <div class="icon-text">
                                <sl-icon name="${route.icon}" class="navbar__icon"></sl-icon>
                                <span class="icon-text__text">
                                    ${route.displayName}
                                </span>
                            </div>
                        </a>
                        ` : html`
                        <sl-dropdown>
                            <a href="#" slot="trigger" @click=${e => e.preventDefault()} class="navbar__link ${route.active ? 'navbar__link--active' : ''}">
                                <div class="icon-text">
                                    ${route.account ? html`
                                    <sl-avatar class="navbar__icon-avatar"></sl-avatar>
                                    ` : html`
                                    <sl-icon name="${route.icon}" class="navbar__icon"></sl-icon>`}
                                    <span class="icon-text__text">
                                        ${route.displayName}
                                    </span>
                                </div>
                            </a>
                            <sl-menu>
                                ${route.subRoutes.map(subRoute => html`
                                <sl-menu-item @click="${e => this.handleSubMenuClick(e, subRoute.path)}">${subRoute.displayName}</sl-menu-item>
                                `)}
                            </sl-menu>
                        </sl-dropdown>
                        `}
                    </li>`)}
                </ul>
                <sl-button slot="footer" type="primary" class="navbar__btn-close" @click="${this.handleMenuCloseClick}">Close</sl-button>
            </sl-drawer>
        </div>`
    }

    /**
     * 
     * @param {number} accessLevel Access level
     * @returns True if access level matches
     */
    checkAccessLevel(accessLevel) {
        return this.user && (accessLevel === -1 || accessLevel === this.user.accessLevel)
    }

    /**
     * Get the routes authorized by the user
     * 
     * @returns The authorized routes by the user
     */
    getRoutes() {
        // Get current path
        const currentPath = window.location.pathname

        const handleClickSubRoute = (e, path) => goToRoute(path)

        const subRoutesServices = [{
                path: "/services/check-up",
                displayName: "Check-up",
                authorized: this.checkAccessLevel(2),
                handleClick: handleClickSubRoute
            },
            {
                path: "/services/grooming",
                displayName: "Grooming",
                authorized: this.checkAccessLevel(2),
                handleClick: handleClickSubRoute
            },
            {
                path: "/services/training",
                displayName: "Training",
                authorized: this.checkAccessLevel(2),
                handleClick: handleClickSubRoute
            }
        ]

        const subRoutesAccount = [{
                path: "/account",
                displayName: "Profile",
                authorized: this.checkAccessLevel(-1),
                handleClick: handleClickSubRoute
            },
            {
                path: "signout",
                displayName: "Sign out",
                authorized: this.checkAccessLevel(-1),
                handleClick: (e, path) => this.handleSignOutClick()
            }
        ]

        const handleClickLink = e => anchorRoute(e)

        const routes = [{
                path: "/",
                displayName: "Home",
                authorized: this.checkAccessLevel(2),
                handleClick: handleClickLink,
                icon: 'house-door'
            },
            {
                path: "/services",
                displayName: "Services",
                authorized: this.checkAccessLevel(2),
                subRoutes: subRoutesServices,
                icon: 'list-ul'
            },
            {
                path: "/appointments",
                displayName: "Appointments",
                authorized: this.checkAccessLevel(-1),
                handleClick: handleClickLink,
                icon: 'calendar3'
            },
            {
                path: "/products",
                displayName: "Products",
                authorized: this.checkAccessLevel(2),
                handleClick: handleClickLink,
                icon: 'grid'
            },
            {
                path: "/manage-products",
                displayName: "Manage Products",
                authorized: this.checkAccessLevel(1),
                handleClick: handleClickLink,
                icon: 'sliders'
            },
            {
                path: "/orders",
                displayName: "Orders",
                authorized: this.checkAccessLevel(-1),
                handleClick: handleClickLink,
                icon: 'card-list'
            },
            // { path: "/reviews", displayName: "Reviews", authorized: this.checkAccessLevel(-1) },
            // { path: "/posts", displayName: "Posts", authorized: this.checkAccessLevel(1) },
            // { path: "/about", displayName: "About", authorized: this.checkAccessLevel(-1) },
            {
                path: "/account",
                displayName: "Account",
                authorized: this.checkAccessLevel(-1),
                account: true,
                subRoutes: subRoutesAccount
            }
        ]

        return routes
            // remove routes that should not be shown in the navigation
            .filter(route => route.authorized)
            .map(route => {
                if (!route.subRoutes) {
                    return route
                }

                route.subRoutes = route.subRoutes.filter(subRoute => subRoute.authorized)
                return route
            })
            // transform data to include a property that indicates if a route is active
            .map(route => ({
                ...route,
                active: route.path === currentPath || (route.path !== '/' && currentPath.indexOf(route.path) !== -1)
            }))
    }

    handleClickTitleLink(e) {
        e.preventDefault()
        if (this.titleLink !== '#') {
            const pathname = e.target.closest('a').pathname
            goToRoute(pathname)
        }
    }

    async handleClickCartLink(e) {
        e.preventDefault()
        const cartEl = this.shadowRoot.querySelector('dc-cart')
        const response = await Cart.getCart(this.user._id.toString())
        if(response.error) {
            Toast.notify(`Cart could not be fetched:\n${response.error.error.message}`, 'danger')
        } else {
            cartEl.cart = response.data
        }

        const dialogEl = this.shadowRoot.querySelector('.dialog')
        dialogEl.show()
    }

    handleViewProduct() {
        const dialogEl = this.shadowRoot.querySelector('.dialog')
        dialogEl.hide()
    }

    /**
     * Hamburger side menu click 
     */
    handleHamburgerClick() {
        const sideMenu = this.shadowRoot.querySelector('.navbar__sidebar')
        sideMenu.show()
    }

    /**
     * Menu click in the side menu 
     * 
     * @param {Event} e Event 
     */
    handleMenuClick(e) {
        e.preventDefault()
        const pathname = e.target.closest('a').pathname
        this.closeSideMenu(pathname)
    }

    /**
     * Sub menu click in the side menu 
     * 
     * @param {Event} e Event 
     * @param {string} pathname Pathname
     */
    handleSubMenuClick(e, pathname) {
        this.closeSideMenu(pathname)
    }

    /**
     * Sign out
     */
    handleSignOutClick() {
        Auth.signOut()
        goToRoute('/signin')
    }

    /**
     * Handle menu close
     */
    handleMenuCloseClick() {
        const sideMenu = this.shadowRoot.querySelector('.navbar__sidebar')

        // hide side menu
        sideMenu.hide()
    }

    /**
     * Close the side menu
     */
    closeSideMenu(pathname) {
        const sideMenu = this.shadowRoot.querySelector('.navbar__sidebar')

        // hide side menu
        sideMenu.hide()
        sideMenu.addEventListener('sl-after-hide', () => {
            const currentPath = window.location.pathname
            // check if current path is the same as the path to navigate to,
            // if that's the case then stay on the same page
            if (pathname === 'signout') {
                this.handleSignOutClick()
            } else {
                if (currentPath !== pathname) {
                    goToRoute(pathname)
                }
            }
        })
    }
}

// Create the component
customElements.define('dc-header', HeaderComponent)