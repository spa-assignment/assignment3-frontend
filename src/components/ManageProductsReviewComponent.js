import { html, LitElement, css, nothing } from 'lit-element'
import { env } from '../env'
import OrderAPI from '../api/OrderAPI'
import Toast from '../Toast'

/**
 * Manage products review component
 */
class ManageProductsReviewComponent extends LitElement {

    /**
     * Properties of the component
     */
    static get properties() {
        return {
            order: {
                type: Object
            },
            selectedProductId: {
                type: Number
            },
            user: {
                type: Object
            }
        }
    }

    set selectedProductId(value) {
        let oldValue = this._selectedProductId
        this._selectedProductId = value
        this.requestUpdate('selectedProductId', oldValue)

        if (this.order && this.order.items) {
            this.selectedItem = this.order.items.find(item => item.product._id.toString() === value)
        } else {
            this.selectedItem = null
        }
    }

    get selectedProductId() {
        return this._selectedProductId
    }

    /**
     * Styles of the component
     */
     static get styles() {
        return [
            css`
            * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
            }

            :host {
                display: block;
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
            
            .products-review__form-field {
                margin-top: 0;
            }
            
            .products-review__btn-delete-review {
                margin-left: 0;
                margin-right: auto;
            }`
        ]
    }

    /**
     * Constructor
     */
    constructor() {
        super()
        this.order = null
        this.selectedItem = null
        this.selectedProductId = -1
    }

    /**
     * Render the html content of the component
     * 
     * @returns The HTML content
     */
    render() {
        return html`
        <sl-form class="form products-review" @sl-submit="${e => this.handleSubmit(e)}">
            <div class="form__field products-review__form-field">
                <sl-select hoist value="${this.selectedProductId}" placeholder="Choose product" @sl-change="${e => this.handleChangeProduct(e)}">
                    ${((this.order && this.order.items) || []).map(item => html`
                    <sl-menu-item value="${item.product._id.toString()}">${item.product.title}</sl-menu-item>
                    `)}
                </sl-select>
            </div>   
            <div class="form__field">
                ${this.selectedItem && this.selectedItem.review && this.selectedItem.review.image ? html`
                <img class="products-review__image" src="${env.apiUrlImage}/${this.selectedItem.review.image}">` : html`
                <div class="products-review__no-image"><strong>No image<br>available</strong></div>`}
            </div> 
            ${ this.user.accessLevel === 2 ? html`
            <div class="form__field">
                <dc-input-file buttonText="Choose" placeholder="[Optional] Upload an image..." ?disabled="${!this.selectedItem}"></dc-input-file>
            </div>` : 
            nothing }
            <div class="form__field">
                <sl-input name="title" placeholder="Title" value="${!this.selectedItem || !this.selectedItem.review || !this.selectedItem.review.title ? '': this.selectedItem.review.title}" ?readonly=${this.user.accessLevel === 1}></sl-input>
            </div>
            <div class="form__field">
                <sl-textarea name="comment" required value="${!this.selectedItem || !this.selectedItem.review ? '': this.selectedItem.review.comment}" ?disabled="${!this.selectedItem}" ?readonly=${this.user.accessLevel === 1}></sl-textarea>
            </div>
            <div class="form__field">
                <sl-rating precision=.5 value="${!this.selectedItem || !this.selectedItem.review ? 0: this.selectedItem.review.stars}" ?disabled="${!this.selectedItem}" ?readonly=${this.user.accessLevel === 1}></sl-rating>
            </div>
            <div class="form__footer">
                ${ this.user.accessLevel === 2 ? 
                this.selectedItem && this.selectedItem.review ? html`
                    <sl-button class="products-review__btn-delete-review" @click=${e => this.handleClickDeleteReview()}>Delete</sl-button>
                    <sl-button type=primary submit class="form__submit products-review__btn-update-review">Update</sl-button>
                    ` : html`
                    <sl-button type=primary submit class="form__submit products-review__btn-add-review" ?disabled="${!this.selectedItem}">Add</sl-button>
                ` : nothing}  
            </div>
        </sl-form>`
    }

    handleChangeProduct(e) {
        if (e.target.value) {
            this.selectedItem = this.order.items.find(item => item.product._id.toString() === e.target.value.toString())
        }

        const pcInputFileEl = this.shadowRoot.querySelector('dc-input-file')
        if (pcInputFileEl) {
            pcInputFileEl.clear()
        }

        this.requestUpdate()
    }

    async getOrder() {
        const response = await OrderAPI.getOrder(this.order._id.toString())

        if(response.error){
            Toast.notify(`Problem fetching order: \n${response.error.error.message}`, 'danger')
        } else {
            this.order = response.data
        }
    }

    async handleClickDeleteReview() {
        const deleteBtn = this.shadowRoot.querySelector('.products-review__btn-delete-review')
        deleteBtn.setAttribute('loading', '')

        const response = await OrderAPI.deleteReview(this.order._id.toString(), this.selectedItem.product._id.toString())
        if (response.error) {
            Toast.notify(`Problem deleting review: \n${response.error.error.message}`, 'danger')
        } else {
            Toast.notify('Review deleting successfully', 'success')
            const pcInputFileEl = this.shadowRoot.querySelector('dc-input-file')
            pcInputFileEl.clear()
            
            await this.getOrder()
            this.selectedItem = this.order.items.find(item => item.product._id.toString() === this.selectedItem.product._id.toString())
        }

        deleteBtn.removeAttribute('loading')
        this.requestUpdate()
        this.completeAction()
    }

    /**
     * Submit sign in
     * 
     * @param {Event} e Event 
     */
    async handleSubmit(e) {
        e.preventDefault()
        const formData = e.detail.formData

        const pcInputFileEl =this.shadowRoot.querySelector('dc-input-file')
        const ratingEl = this.shadowRoot.querySelector('sl-rating')

        formData.append('image', pcInputFileEl.value)
        formData.append('stars', ratingEl.value)

        const submitBtn = this.shadowRoot.querySelector('.form__submit')
        submitBtn.setAttribute('loading', '')

        const response = await OrderAPI.updateReview(this.order._id.toString(), this.selectedItem.product._id.toString(), formData)
        if (response.error) {
            Toast.notify(`Problem updating review: \n${response.error.error.message}`, 'danger')
        } else {
            Toast.notify('Review updated successfully', 'success')
            pcInputFileEl.clear()

            await this.getOrder()
            this.selectedItem = this.order.items.find(item => item.product._id.toString() === this.selectedItem.product._id.toString())
        }

        submitBtn.removeAttribute('loading')
        this.requestUpdate()
        this.completeAction()
    }

    completeAction() {
        // create the custom event
        const reviewUpdatedEvent = new CustomEvent('reviewupdated')

        // emit the custom event
        this.dispatchEvent(reviewUpdatedEvent)
    }
}

// Create the component
customElements.define('dc-manage-products-review', ManageProductsReviewComponent)