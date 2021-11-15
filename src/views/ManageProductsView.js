
import { html, render, nothing } from 'lit-html'
import App from '../App'
import Utils from '../Utils'
import Auth from '../Auth'
import moment from 'moment'
import ProductsAPI from '../api/ProductsAPI'
import Toast from '../Toast'
import { env } from '../env'

/**
 * Manage products view
 */
class ManageProductsView {

    /**
     * Constructor
     */
    constructor() {
        this.description = `View and manage list of the products.`
        this.products = []
    }

    /**
     * Initialise the view
     */
    init() {
        document.title = 'Manage products'
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
            Utils.fadeInFromTopStaggered('.table__row', timeline, duration, stagger)
        }
    }

    /**
     * Render the view
     */
    render() {
        const template = html`
        <dc-header title="Manage products" user=${JSON.stringify(Auth.currentUser)}></dc-header>
        <div class="page-content-container page-content-container--footer">
            <div class="page-content page-content--horizontal-align--center page-content--offset--top-small">
                <div class="view-manage-products manage-products">
                    <div class="manage-products__heading">
                        Manage products
                    </div>
                    <div class="manage-products__content">
                        <div class="manage-products__description">
                            ${this.description}
                        </div>
                        <div class="manage-products__items-container">
                            <div class="manage-products__items-header">
                                Products
                                <hr>
                            </div>
                            <div class="manage-products__items">
                                <div class="manage-products__table-container">
                                    <div class="table manage-products__table">
                                        <div class="table__headers">
                                            <div class="table__header manage-products__table-header-id">
                                                Id
                                            </div>
                                            <div class="table__header manage-products__table-header-image">
                                                Image
                                            </div>
                                            <div class="table__header manage-products__table-header-title">
                                                Title
                                            </div>
                                            <div class="table__header manage-products__table-header-description">
                                                Description
                                            </div>
                                            <div class="table__header manage-products__table-header-price">
                                                Price (Rs.)
                                            </div>
                                            <div class="table__header manage-products__table-header-quantity">
                                                Quantity
                                            </div>
                                            <div class="table__header manage-products__table-header-actions">
                                                Actions
                                            </div>
                                        </div>
                                        <div class="table__rows">
                                            <sl-form class="table__row table__row-form manage-products__table-row" @sl-submit=${e => this.handleSubmitAddProduct(e)}>
                                                <div class="table__cell manage-products__table-cell-id">
                                                    <sl-input type="text" readonly></sl-input>
                                                </div>
                                                <div class="table__cell manage-products__table-cell-image">
                                                    <dc-input-file id="product-add-image" placeholder="[Otional] Image" alignVertical></dc-input-file>
                                                </div>
                                                <div class="table__cell manage-products__table-cell-title">
                                                    <sl-input id="product-add-title" type="text" name="title" required></sl-input>
                                                </div>
                                                <div class="table__cell manage-products__table-cell-description">
                                                    <sl-textarea id="product-add-description" type="text" name="description" rows="3" required></sl-textarea>
                                                </div>
                                                <div class="table__cell manage-products__table-cell-price">
                                                    <sl-input id="product-add-price" type="number" name="price" value="1" min="1" required></sl-input>
                                                </div>
                                                <div class="table__cell manage-products__table-cell-quantity">
                                                    <sl-input id="product-add-quantity" type="number" name="quantity" value="0" min="0" required></sl-input>
                                                </div>
                                                <div class="table__cell manage-products__table-cell-actions">
                                                    <sl-button id="product-add" type=primary submit>Add</sl-button>
                                                </div>
                                            </sl-form>
                                            ${this.products.map(product => html`
                                            <sl-form class="table__row table__row-form"  @sl-submit=${e => this.handleSubmitUpdateProduct(e, product)}>
                                                <div class="table__cell manage-products__table-cell-id">
                                                    <sl-input type="text" value=${product._id.toString()} readonly></sl-input>
                                                </div>
                                                <div class="table__cell manage-products__table-cell-image">
                                                    <div class="manage-products__image-container">
                                                        ${product.image ? html`
                                                        <img class="manage-products__image" src="${env.apiUrlImage}/${product.image}">` : html`
                                                        <div class="manage-products__no-image"><strong>No image<br>available</strong></div>`}
                                                        <dc-input-file id="product-image-update-${product._id.toString()}" placeholder="[Otional] Image" alignVertical></dc-input-file>
                                                    </div>
                                                </div>
                                                <div class="table__cell manage-products__table-cell-title">
                                                    <sl-input type="text" name="title" value="${product.title}" required></sl-input>
                                                </div>
                                                <div class="table__cell manage-products__table-cell-description">
                                                    <sl-textarea type="text" name="description" value="${product.description}" rows="10" required></sl-textarea>
                                                </div>
                                                <div class="table__cell manage-products__table-cell-price">
                                                    <sl-input type="number" name="price" value="1" min="1" value="${product.price}" required></sl-input>
                                                </div>
                                                <div class="table__cell manage-products__table-cell-quantity">
                                                    <sl-input type="number" name="quantity" value="0" min="0" value="${product.quantity}" required></sl-input>
                                                </div>
                                                <div class="table__cell manage-products__table-cell-actions">
                                                    <sl-button id="product-update-${product._id.toString()}" submit>Update</sl-button>
                                                    <sl-button id="product-delete-${product._id.toString()}" type=danger class="manage-products__btn-delete" @click=${e => this.handleSubmitDeleteProduct(e, product)}>Delete</sl-button>
                                                </div>
                                            </sl-form>
                                            `)}
                                        </div>
                                    </div>
                                </div>
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
     * Handle form submit
     *
     * @param {Event} e
     */
    async handleSubmitAddProduct(e) {
        e.preventDefault()
        const formData = e.detail.formData

        const pcInputFileEl = document.getElementById('product-add-image')
        formData.append('image', pcInputFileEl.value)

        const submitBtn = document.getElementById('product-add')
        submitBtn.setAttribute('loading', '')

        const response = await ProductsAPI.addProduct(formData)
        if (response.error) {
            Toast.notify(`Problem adding product: \n${response.error.error.message}`, 'danger')
        } else {
            Toast.notify('Product added successfully', 'success')
        }

        submitBtn.removeAttribute('loading')
        this.getProducts(null, 0.2, 0.1)
    }

    async handleSubmitUpdateProduct(e, product) {
        e.preventDefault()
        const formData = e.detail.formData

        const pcInputFileEl = document.getElementById(`product-image-update-${product._id.toString()}`)
        formData.append('image', pcInputFileEl.value)

        const submitBtn = document.getElementById(`product-update-${product._id.toString()}`)
        submitBtn.setAttribute('loading', '')

        const response = await ProductsAPI.updateProduct(product._id.toString(), formData)
        if (response.error) {
            Toast.notify(`Problem updating product: \n${response.error.error.message}`, 'danger')
        } else {
            Toast.notify('Product updated successfully', 'success')
        }

        submitBtn.removeAttribute('loading')
        this.getProducts(null, 0.2, 0.1)
    }

    async handleSubmitDeleteProduct(e, product) {
        const submitBtn = document.getElementById(`product-delete-${product._id.toString()}`)
        submitBtn.setAttribute('loading', '')

        const response = await ProductsAPI.deleteProduct(product._id.toString())
        if (response.error) {
            Toast.notify(`Problem deleting product: \n${response.error.error.message}`, 'danger')
        } else {
            Toast.notify('Product deleted successfully', 'success')

            document.getElementById('product-add-image').clear()
            document.getElementById('product-add-title').value = ''
            document.getElementById('product-add-description').value = ''
            document.getElementById('product-add-price').value = 1
            document.getElementById('product-add-quantity').value = 1
        }

        submitBtn.removeAttribute('loading')
        this.getProducts(null, 0.2, 0.1)
    }
}

// Export an instance of the view
export default new ManageProductsView()