
import { html, render } from 'lit-html'
import App from '../App'
import Utils from '../Utils'
import Auth from '../Auth'
import { goToRoute } from '../Router'
import ProductsAPI from '../api/ProductsAPI'
import Toast from '../Toast'
import { env } from '../env'
import Cart from '../Cart'

/**
 * Products view
 */
class ProductsView {

    /**
     * Constructor
     */
    constructor() {
        this.description = `Browse through our products for your dogs. Add to cart the products that you need and place an order. The order will be delivered to your specified location after some time.`;

        this.products = []
    }

    /**
     * Initialise the view
     */
    init() {
        document.title = 'Products'
        this.render()
        const timeline = Utils.fadeInFromTop('.page-content')
        this.getProducts(timeline)
    }

    async getProducts(timeline=null, duration=0.5, stagger=0.3) {
        const response = await ProductsAPI.getProducts()

        if(response.error){
            Toast.notify(`Problem fetching products: \n${response.error.error.message}`, 'danger')
        } else {
            this.products = response.data
            if (this.products.length === 0) {
                Toast.notify(`No products available`, 'success')
            } else {
                Toast.notify(`${this.products.length} products fetched`, 'success')
            }
            
            this.render()
            Utils.fadeInFromTopStaggered('.products__item', timeline, duration, stagger)
        }
    }

    /**
     * Render the view
     */
    render() {
        const template = html`
        <dc-header title="Products" user=${JSON.stringify(Auth.currentUser)}></dc-header>
        <div class="page-content-container page-content-container--footer">
            <div class="page-content page-content--horizontal-align--center page-content--offset--top-small">
                <div class="view-products products">
                    <div class="products__heading">
                        Products
                    </div>
                    <div class="products__content">
                        <div class="products__description">
                            ${this.description}
                        </div>
                        <div class="products__items-container">
                            <div class="products__items-header">
                                Products
                                <hr>
                            </div>
                            <div class="products__items">
                                ${this.products.map(product => html`
                                <sl-card class="products__item">
                                    <div class="card-image products__item-content">
                                        <div class="card-image__image-container products__item-image-container">
                                            ${product.image ? html`
                                            <img class="products__item-image" src="${env.apiUrlImage}/${product.image}">` : html`
                                            <div class="products__item-no-image"><strong>No image<br>available</strong></div>`}
                                        </div>
                                        <div class="products__item-text-container">
                                            <div class="card-image__text products__item-text">
                                                <div class="products__item-heading">
                                                    ${product.title}
                                                </div>
                                                ${product.description}
                                                <br>
                                                <br>
                                            </div>
                                            <div class="products__item-actions">
                                                <sl-button type="primary" pill @click="${e => this.handleClickAddToCart(e, product)}" id="add-to-cart-${product._id.toString()}" class="products__item-add-to-cart">Add to cart</sl-button>
                                                <sl-button type="primary" pill @click="${e => this.handleClickView(e, product._id.toString())}">View</sl-button>
                                            </div>
                                        </div>
                                    </div>
                                </sl-card>
                                `)}
                            </div>
                        </div>
                    </div>                        
                </div>    
            </div>
        </div>
        <dc-footer fixedFooter></dc-footer>
        `
        render(template, App.rootEl)
    }

    /**
     * Handle the click on a service
     * 
     * @param {number} productId 
     */
    handleClickView(e, productId) {
        const params = new URLSearchParams({
            productId: productId.toString(),
        })

        goToRoute(`/product?${params.toString()}`)
    }

    async handleClickAddToCart(e, product) {
        const addToCartBtn = document.querySelector(`#add-to-cart-${product._id.toString()}`)
        addToCartBtn.setAttribute('loading', '')
        
        const formData = new FormData()
        formData.append('productId', product._id)
        formData.append('quantity', 1)

        const response = await Cart.addItem(Auth.currentUser._id.toString(), formData)
        if(response.error) {
            Toast.notify(`Product could not be added to cart:\n${response.error.error.message}`, 'danger')
        } else {
            Toast.notify('Product added to cart', 'success')
        }

        addToCartBtn.removeAttribute('loading')
    }
}

// Export an instance of the view
export default new ProductsView()