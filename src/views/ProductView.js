
import { html, render } from 'lit-html'
import App from '../App'
import Utils from '../Utils'
import Auth from '../Auth'
import Cart from '../Cart'
import ProductsAPI from '../api/ProductsAPI'
import OrderAPI from '../api/OrderAPI'
import Toast from '../Toast'
import { env } from '../env'

/**
 * Product view
 */
class ProductView {

    /**
     * Constructor
     */
    constructor() {
        this.product = {
            title: `Product`,
            description: 'Product description',
            price: 100,
            image: '',
            _id: -1,
            quantity: 0
         }

        this.reviews = []
    }

    /**
     * Initialise the view
     */
    async init() {
        document.title = `Product`

        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        this.product = { _id: params.productId }
        await this.getProduct()

        this.render()

        if (this.product) {
            document.title = `Product - ${this.product.title}`
            const timeline = Utils.fadeInFromTop('.page-content')
            this.getReviews(timeline)
        }
    }

    async getProduct() {
        const response = await ProductsAPI.getProduct(this.product._id.toString())

        if(response.error){
            Toast.notify(`Problem fetching product: \n${response.error.error.message}`, 'danger')
            this.product = null
        } else {
            this.product = response.data
        }
    }

    async getReviews(timeline=null, duration=0.5, stagger=0.3) {
        const response = await OrderAPI.getReviews(this.product._id.toString())

        if(response.error){
            Toast.notify(`Problem fetching products reviews: \n${response.error.error.message}`, 'danger')
        } else {
            this.reviews = response.data
            this.render()
            Utils.fadeInFromTopStaggered('.product__review', timeline, duration, stagger)
        }
    }

    /**
     * Render the view
     */
    render() {
        const template = html`
        <dc-header title="Product${this.product ? ` - ${this.product.title}` : ''}" user=${JSON.stringify(Auth.currentUser)}></dc-header>
        <div class="page-content-container page-content-container--footer">
            <div class="page-content page-content--horizontal-align--center page-content--offset--top-small">
                ${!this.product ? html`
                Product cannot be fetched. Product might no longer exist` : html`
                <div class="view-product product">
                    <div class="product__heading">
                        ${this.product.title}
                    </div>
                    <div class="product__content">
                        <div class="product__detail">
                            ${this.product.image ? html`
                            <img class="product__image" src="${env.apiUrlImage}/${this.product.image}">` : html`
                            <div class="product__no-image"><strong>No image<br>available</strong></div>`}
                            <div class="product__description">
                                <h2>Description: </h2> 
                                <br />
                                ${this.product.description}
                                <br />
                                <br />
                                Price: Rs. <strong>${this.product.price}</strong> 
                                <br />
                                <br />
                                <sl-form @sl-submit="${e => this.handleSubmit(e)}">
                                    <div class="product__actions">
                                        <div class="product__quantity">
                                            <sl-input type=number name="quantity" placeholder="quantity" value=${this.product.quantity === 0 ? 0 : 1} min=${this.product.quantity === 0 ? 0 : 1} max=${this.product.quantity} ?disabled=${this.product.quantity === 0}></sl-input>
                                        </div>
                                        <div class="product__cart">
                                            <sl-button type="primary" submit ?disabled=${this.product.quantity === 0} class="form-submit-add-to-card">Add to cart</sl-button>
                                        </div>
                                    </div>
                                </sl-form>
                            </div>
                        </div>
                        <div class="product__reviews-container">
                            <div class="product__reviews-header">
                                Reviews
                                <hr>
                            </div>
                            <div class="product__reviews">
                                ${this.reviews.map(review => html`
                                <sl-card class="product__review">
                                    <div class="card-image product__review-content">
                                        <div class="card-image__image-container product__review-image-container">
                                            ${review.image ? html`
                                            <img class="product__review-image" src="${env.apiUrlImage}/${review.image}">` : html`
                                            <div class="product__review-no-image"><strong>No image<br>available</strong></div>`}
                                        </div>
                                        <div class="card-image__text product__review-text">
                                            <div class="product__review-heading">
                                                ${review.title}
                                            </div>
                                            ${review.comment}
                                            <br>
                                            <br>
                                            By : ${review.user.firstName} ${review.user.lastName}
                                        </div>
                                    </div>
                                    <div slot="footer">
                                        <sl-rating precision=.5 value="${review ? review.stars : 0}" class="product__review-rating" readonly></sl-rating>
                                    </div>
                                </sl-card>
                                `)}
                            </div>
                        </div>
                    </div>                        
                </div>  
                `}
            </div>
        </div>
        <dc-footer fixedFooter></dc-footer>
        `
        render(template, App.rootEl)
    }

    /**
     * Handle form submit
     * 
     * @param {Event} e 
     */
    async handleSubmit(e) {
        e.preventDefault()
        const formData = e.detail.formData
        formData.append('productId', this.product._id)
        
        const submitBtn = document.querySelector('.form-submit-add-to-card')
        submitBtn.setAttribute('loading', '')

        const response = await Cart.addItem(Auth.currentUser._id.toString(), formData)
        if(response.error) {
            Toast.notify(`Product could not be added to cart:\n${response.error.error.message}`, 'danger')
        } else {
            Toast.notify('Product added to cart', 'success')
            document.querySelector('sl-input').value = 1
        }

        submitBtn.removeAttribute('loading')

        await this.getProduct()
        this.render()
    }
}

// Export an instance of the view
export default new ProductView()