
import { html, render, nothing } from 'lit-html'
import App from '../App'
import Utils from '../Utils'
import Auth from '../Auth'
import Toast from '../Toast'
import { env } from '../env'
import OrderAPI from '../api/OrderAPI'
import moment from 'moment'

/**
 * Orders view
 */
class OrdersView {

    /**
     * Constructor
     */
    constructor() {
        this.description = `View and manage the list of orders previously made here.`;

        this.steps = [
            {
                icon: 'search',
                header: '1. View the orders made',
                description: 'View and consult details of the orders made, such as date, status etc.'
            },
            {
                icon: 'chat-right-text',
                header: '2. Modify status',
                description: 'Modify the status of the order if needed'
            },
            {
                icon: 'people',
                header: '3. Leave a review',
                description: 'Leave a review of on the order if you want.'
            }
        ]

        this.orders = []
    }

    /**
     * Initialise the view
     */
    init() {
        document.title = 'Orders'
        this.render()
        const timeline = Utils.fadeInFromTop('.page-content')
        this.getOrders(timeline)
    }

    async getOrders(timeline=null, duration=0.5, stagger=0.3) {

        let userId = null
        if (Auth.currentUser.accessLevel === 2) {
            userId = Auth.currentUser._id
        }

        const response = await OrderAPI.getOrders(userId)

        if(response.error){
            Toast.notify(`Problem fetching orders: \n${response.error.error.message}`, 'danger')
        } else {
            this.orders = response.data
            if (this.orders.length === 0) {
                Toast.notify(`No orders available`, 'success')
            } else {
                Toast.notify(`${this.orders.length} orders fetched`, 'success')
            }
            
            console.log(this.orders)
            this.render()
            Utils.fadeInFromTopStaggered('.table__row', timeline, duration, stagger)
        }
    }

    /**
     * Render the view
     */
    render() {
        const template = html`
        <dc-header title="Orders" user=${JSON.stringify(Auth.currentUser)}></dc-header>
        <div class="page-content-container page-content-container--footer">
            <div class="page-content page-content--horizontal-align--center page-content--offset--top-small">
                <div class="view-orders orders">
                    <div class="orders__heading">
                        Orders
                    </div>
                    <div class="orders__content">
                        <div class="orders__description">
                            ${this.description}
                        </div>
                        ${Auth.currentUser.accessLevel === 2 ? html`
                        <div class="orders__steps-container">
                            <div class="orders__steps-header">
                                Steps
                                <hr>
                            </div>
                            <div class="orders__steps">
                                ${this.steps.map(step => html`
                                <div class="orders__step">
                                    <div class="orders__step-header">
                                        <sl-icon name="${step.icon}" class="orders__step-icon"></sl-icon>
                                        <h4>${step.header}</h4>
                                    </div>
                                    ${step.description}
                                </div>
                                `)}
                            </div>
                        </div>
                        ` : 
                        nothing}
                        <div class="orders__items-container">
                            <div class="orders__items-header">
                                Orders
                                <hr>
                            </div>
                            <div class="orders__items">
                                <div class="orders__table-container">
                                    <div class="table orders__table">
                                        <div class="table__headers">
                                            <div class="table__header orders__table-header-order-id">
                                                Order id
                                            </div>
                                            <div class="table__header orders__table-header-products">
                                                Products
                                            </div>
                                            <div class="table__header orders__table-header-made-on">
                                                Made on
                                            </div>
                                            <div class="table__header orders__table-header-total">
                                                Total (Rs.)
                                            </div>
                                            <div class="table__header orders__table-cell-status">
                                                Status
                                            </div>
                                            <div class="table__header orders__table-header-review">
                                                Review
                                            </div>
                                            ${Auth.currentUser.accessLevel === 1 ? html`
                                            <div class="table__header orders__table-header-user">
                                                User
                                            </div>` : 
                                            nothing}
                                        </div>
                                        <div class="table__rows">
                                            ${this.orders.map(order => html`
                                            <div class="table__row">
                                                <div class="table__cell orders__table-cell-order-id">
                                                    ${order._id.toString()}
                                                </div>
                                                <div class="table__cell orders__table-cell-products">
                                                    ${order.items.map(item => html`
                                                    ID: ${item.product._id.toString()}
                                                    <br />
                                                    Title: ${item.product.title}
                                                    <br />
                                                    Qty.: ${item.quantity}
                                                    <br />
                                                    Price (Rs.): ${item.price}
                                                    <br />
                                                    <br />`)}
                                                </div>
                                                <div class="table__cell orders__table-cell-made-on">
                                                    ${moment(new Date(order.createdAt)).format('D MMM YYYY @ HH:mm')}
                                                </div>
                                                <div class="table__cell orders__table-cell-total">
                                                    ${order.total}
                                                </div>
                                                <sl-form class="table__cell orders__table-cell-status" @sl-submit=${e => this.handleSubmitUpdateStatus(e, order)}>
                                                    <sl-select name="status" value="${order.status}" hoist ?disabled=${!this.canUpdateStatus(order)}>
                                                        ${this.getAuthorisedStatuses(order).map(status => html`
                                                        <sl-menu-item value="${status.value}">${status.displayMember}</sl-menu-item>
                                                        `)}
                                                    </sl-select>
                                                    ${this.canUpdateStatus(order) ? html`
                                                    <sl-button type="primary" id="status-${order._id.toString()}" class="orders__table-btn-update" submit>Update</sl-button>
                                                    ` :
                                                    nothing 
                                                    }
                                                </sl-form>
                                                <div class="table__cell orders__table-cell-review">
                                                    <sl-button @click="${e => this.handleClickManageProductsReviewDialog(e, order._id.toString())}" ?disabled=${!this.canWriteReview(order)}>Review</sl-button>
                                                    <sl-dialog id="review-${order._id.toString()}" label="Review" class="dialog">
                                                        <dc-manage-products-review .order="${order}" selectedProductId="${(order.items.length === 1 ? order.items[0].product._id.toString() : -1)}" .user=${Auth.currentUser}></dc-manage-products-review>
                                                    </sl-dialog>
                                                </div>
                                                ${Auth.currentUser.accessLevel === 1 ? html`
                                                <div class="table__cell orders__table-cell-user">
                                                    ${order.user.firstName}
                                                    <br>
                                                    ${order.user.lastName}
                                                    <br>
                                                    ${order.user.email}
                                                    <br>
                                                    Address: ${order.address}
                                                    <br>
                                                    Tel: ${order.phoneNumber}
                                                </div>` : 
                                                nothing}
                                            </div>
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

    handleClickManageProductsReviewDialog(e, orderId) {
        const dialogEl = document.getElementById(`review-${orderId}`)
        dialogEl.show()
    }

        /**
     * Handle form submit
     *
     * @param {Event} e
     */
    async handleSubmitUpdateStatus(e, order) {
        e.preventDefault()
        const formData = e.detail.formData

        if (order.status === formData.get('status')) {
            Toast.notify(`Status already set to '${order.status}'`, 'info')
            return
        }

        const submitBtn = document.getElementById(`status-${order._id.toString()}`)
        submitBtn.setAttribute('loading', '')

        const response = await OrderAPI.updateStatus(order._id.toString(), formData)
        if (response.error) {
            Toast.notify(`Problem updating status: \n${response.error.error.message}`, 'danger')
        } else {
            Toast.notify('Status updated successfully', 'success')
        }

        submitBtn.removeAttribute('loading')
        this.getOrders(null, 0.2, 0.1)
    }

    getAuthorisedStatuses(order) {
        const status = []

        switch (order.status) {
            case 'pending':
                status.push({value: 'pending', displayMember: 'Pending'})

                if (Auth.currentUser.accessLevel === 1) {
                    status.push({value: 'accepted', displayMember: 'Accepted'})
                    status.push({value: 'rejected', displayMember: 'Rejected'})
                }
                status.push({value: 'cancelled', displayMember: 'Cancelled'})
                break

            case 'accepted':
                status.push({value: 'accepted', displayMember: 'Accepted'})
                if (Auth.currentUser.accessLevel === 1) {
                    status.push({value: 'complete', displayMember: 'Complete'})
                }
                break

            case 'complete':
                status.push({value: 'complete', displayMember: 'Complete'})
                break

            case 'cancelled':
                status.push({value: 'cancelled', displayMember: 'Cancelled'})
                break

            case 'rejected':
                status.push({value: 'rejected', displayMember: 'Rejected'})
                break
        }

        console.log(status)
        return status
    }

    getType(type) {
        switch (type) {
            case 'check_up':
                return 'Check up'

            case 'grooming':
                return 'Grooming'

            case 'training':
                return 'Training'

            default:
                return 'Unknown'
        }
    }

    canUpdateStatus(order) {
        return !(['complete', 'rejected', 'cancelled'].indexOf(order.status) !== -1 || (Auth.currentUser.accessLevel === 2 && 'accepted' === order.status))
    }

    canWriteReview(order) {
        return order.status === 'complete'
    }
}

// Export an instance of the view
export default new OrdersView()