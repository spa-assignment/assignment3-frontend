import { html, LitElement, css } from 'lit-element'
import Cart from '../Cart'
import Toast from '../Toast'
import { env } from '../env'
import { goToRoute } from '../Router'
import OrderAPI from '../api/OrderAPI'

/**
 * Cart component
 */
class CartComponent extends LitElement {

    /**
     * Properties of the component
     */
    static get properties() {
        return {
            cart: {
                type: Array
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
            css`
            * {
                box-sizing: bcart-box;
                padding: 0;
                margin: 0;
            }

            .cart-footer {
                margin-top: 1rem;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .cart__items {
                max-height: 460px;
                width: 100%;
                display: flex;
                flex-direction: column;
                overflow: auto;
            }

            .cart__item {
                margin-bottom: 0.5rem;
            }

            .cart__item::part(body) {
                padding: 0.5rem;
            }

            .cart__item-content {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: row;
            }

            .cart__item-image-container {
                max-width: 250px;
            }

            .cart__item-image {
                width: 120px;
                height: 120px;
                object-fit: cover;
            }

            .cart__item-no-image {
                width: 120px;
                height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 5px;
                background-color: rgb(220, 220, 220);
                color: rgb(140, 140, 140);
            }

            .cart__item-text {
                margin-left: 0.5rem;
                width: 100%;
                overflow: auto;
                flex-grow: 1;
            }

            .cart__item-text-container {
                width: 100%;
                display: flex;
                justify-content: space-between;
                flex-direction: row;
            }

            .cart__item-heading {
                font-size: 1rem;
                font-weight: 900;
            }

            .cart__item-actions {
                margin-top: auto;
                margin-bottom: 0;
                display: flex;
                justify-content: flex-end;
                flex-direction: column;
            }

            .cart__item-btn-remove {
                margin-top: 0.5rem;
            }
            
            @media all and (max-width: 768px) {
                .cart__item-text-container {
                    flex-direction: column;
                }

                .cart__item-actions {
                    margin-top: 0.5rem;
                    flex-direction: row;
                    justify-content: space-between;
                }

                .cart__item-image {
                    width: 100px;
                    height: 100px;
                }

                .cart__item-no-image {
                    width: 100px;
                    height: 100px;
                }

                .cart__items {
                    height: unset;
                    overflow: unset;
                }

                .cart__item-btn-remove {
                    margin-top: unset;
                }
            }

            .place-order__form-field {
                margin-top: 0;
            }

            .form__field {
                margin-top: 1rem;
            }

            .form__field-label {
                font-size: 1.2rem;
                font-weight: 500;
            }

            .form__footer {
                margin-top: 1rem;
                display: flex;
                justify-content: flex-end;
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
            `
        ]
    }

    constructor() {
        super()
        this.cart = Cart.cart
    }

    /**
     * Render the html content of the component
     *
     * @returns The HTML content
     */
    render() {
        return html`
        ${this.cart && this.cart.length > 0 ? html`
        <div class="cart__items">
            ${this.cart.map(cartItem => html`
            <sl-card class="cart__item">
                <div class="card-image cart__item-content">
                    <div class="card-image__image-container cart__item-image-container">
                        ${cartItem.product.image ? html`
                        <img class="cart__item-image" src="${env.apiUrlImage}/${cartItem.product.image}">` : html`
                        <div class="cart__item-no-image"><strong>No image<br>available</strong></div>`}
                    </div>
                    <div class="cart__item-text-container">
                        <div class="card-image__text cart__item-text">
                            <div class="cart__item-heading">
                                ${cartItem.product.title}
                            </div>
                            Id: ${cartItem.product._id.toString()}
                            <br>
                            Price (Rs.): ${cartItem.product.price}
                            <br>
                            Quantity: ${cartItem.quantity}
                            <br>
                            Total (Rs.): ${cartItem.quantity * cartItem.product.price}
                        </div>
                        <div class="cart__item-actions">
                            <sl-button type="primary" pill @click=${e => this.handleClickView(e, cartItem)}>view</sl-button>
                            <sl-button type="danger" pill @click=${e => this.handleClickRemove(e, cartItem)} class="cart__item-btn-remove" id="remove-${cartItem.product._id.toString()}">Remove</sl-button>
                        </div>
                    </div>
                </div>
            </sl-card>
            `)}
        </div>` : html`
        <strong>No item</strong>
        `}
        <div class="cart-footer">
            <span>Total: <strong>Rs. ${this.getTotal()}</strong></span>
            <sl-button type="primary" pill class="card__place-order" ?disabled=${!this.cart || this.cart.length === 0} @click=${e => this.handleClickPlaceOrder()}>Place order</sl-button>
            <sl-dialog label="Order" class="dialog">
                <sl-form class="form" @sl-submit=${(e) => this.handleSubmitPlaceOrder(e)}>
                    <div class="place-order__form-field">
                        <div class="form__field-label">
                            Address for delivery:
                        </div>
                        <sl-textarea id='place-order-address' type="text" name="address" value="${this.user.address ? this.user.address: ''}" required></sl-textarea>
                    </div>
                    <div class="form__field">
                        <div class="form__field-label">
                            Phone number:
                        </div>
                        <sl-input id='place-order-phone-number' type="tel" name="phoneNumber" value="${this.user.phoneNumber ? this.user.phoneNumber: ''}" required></sl-input>
                    </div>
                    <div class="form__footer">
                        <sl-button type="primary" submit class="form__submit">Place order</sl-button>
                    </div>
                </sl-form>
            </sl-dialog>
        </div>`
    }

    async handleClickRemove(e, cartItem) {
        const removeBtn = this.shadowRoot.querySelector(`#remove-${cartItem.product._id.toString()}`)
        removeBtn.setAttribute('loading', '')

        let response = await Cart.removeItem(this.user._id.toString(), cartItem)

        if(response.error) {
            Toast.notify(`Item could not be deleted:\n${response.error.error.message}`, 'danger')
        } else {
            response = await Cart.getCart(this.user._id.toString())
            if(response.error) {
                Toast.notify(`Cart could not be fetched:\n${response.error.error.message}`, 'danger')
            } else {
                this.cart = response.data
            }
        }

        removeBtn.removeAttribute('loading')

        this.requestUpdate()
    }

    getTotal() {
        return this.cart.reduce((prev, curr) => prev + (curr.product.price * curr.quantity), 0)
    }

    handleClickView(e, cartItem) {
        const params = new URLSearchParams({
            productId: cartItem.product._id.toString(),
        })

        goToRoute(`/product?${params.toString()}`)

        // create the custom event
        const viewProductEvent = new CustomEvent('viewproduct')
        this.dispatchEvent(viewProductEvent)
    }

    handleClickPlaceOrder() {
        const dialogEl = this.shadowRoot.querySelector('.dialog')
        dialogEl.show()
    }

    async handleSubmitPlaceOrder(e) {
        e.preventDefault()
        const formData = e.detail.formData

        formData.append('total', this.getTotal())
        formData.append('user', this.user._id)
        formData.append('items', JSON.stringify(this.cart.map(cartItem => ({
            product: cartItem.product._id,
            price: cartItem.product.price,
            quantity: cartItem.quantity}))))

        const submitBtn = this.shadowRoot.querySelector('.form__submit')
        submitBtn.setAttribute('loading', '')

        const response = await OrderAPI.addOrder(formData)
        if (response.error) {
            Toast.notify(`Problem placing order: \n${response.error.error.message}`, 'danger')
        } else {
            Toast.notify('Order placed successfully', 'success', 5000)

            this.shadowRoot.getElementById('place-order-address').value = ''
            this.shadowRoot.getElementById('place-order-phone-number').value = ''

            const response = await Cart.getCart(this.user._id.toString())
            if(response.error) {
                Toast.notify(`Cart could not be fetched:\n${response.error.error.message}`, 'danger')
            } else {
                this.cart = response.data
            }

            const dialogEl = this.shadowRoot.querySelector('.dialog')
            dialogEl.hide()
        }

        submitBtn.removeAttribute('loading')
        this.requestUpdate()
    }
}

// Create the component
customElements.define('dc-cart', CartComponent)