
import { html, render, nothing } from 'lit-html'
import App from '../App'
import Utils from '../Utils'
import Auth from '../Auth'
import moment from 'moment'
import AppointmentAPI from '../api/AppointmentAPI'
import Toast from '../Toast'

/**
 * Appointments view
 */
class AppointmentsView {

    /**
     * Constructor
     */
    constructor() {
        this.description = `View and manage a list of the appointments, previously made, here.`;

        this.steps = [
            {
                icon: 'search',
                header: '1. View the appointments made',
                description: 'View and consult details of the appointments made, such as date, status etc.'
            },
            {
                icon: 'chat-right-text',
                header: '2. Modify status',
                description: 'Modify the status of the appointment if needed'
            },
            {
                icon: 'people',
                header: '3. Leave a review',
                description: 'Leave a review of about the appointment if you want.'
            }
        ]

        this.appointments = []
    }

    /**
     * Initialise the view
     */
    init() {
        document.title = 'Appointments'
        this.render()
        const timeline = Utils.fadeInFromTop('.page-content')
        this.getAppointments(timeline)
    }

    async getAppointments(timeline=null, duration=0.5, stagger=0.3) {

        let userId = null
        if (Auth.currentUser.accessLevel === 2) {
            userId = Auth.currentUser._id
        }

        const response = await AppointmentAPI.getAppointments(userId)

        if(response.error){
            Toast.notify(`Problem fetching appointments: \n${response.error.error.message}`, 'danger')
        } else {
            this.appointments = response.data
            if (this.appointments.length === 0) {
                Toast.notify(`No appointments available`, 'success')
            } else {
                Toast.notify(`${this.appointments.length} appointments fetched`, 'success')
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
        <dc-header title="Appointments" user=${JSON.stringify(Auth.currentUser)}></dc-header>
        <div class="page-content-container page-content-container--footer">
            <div class="page-content page-content--horizontal-align--center page-content--offset--top-small">
                <div class="view-appointments appointments">
                    <div class="appointments__heading">
                        Appointments
                    </div>
                    <div class="appointments__content">
                        <div class="appointments__description">
                            ${this.description}
                        </div>
                        ${Auth.currentUser.accessLevel === 2 ? html`
                        <div class="appointments__steps-container">
                            <div class="appointments__steps-header">
                                Steps
                                <hr>
                            </div>
                            <div class="appointments__steps">
                                ${this.steps.map(step => html`
                                <div class="appointments__step">
                                    <div class="appointments__step-header">
                                        <sl-icon name="${step.icon}" class="appointments__step-icon"></sl-icon>
                                        <h4>${step.header}</h4>
                                    </div>
                                    ${step.description}
                                </div>
                                `)}
                            </div>
                        </div>` : 
                        nothing}
                        <div class="appointments__items-container">
                            <div class="appointments__items-header">
                                Appointments
                                <hr>
                            </div>
                            <div class="appointments__items">
                                <div class="appointments__table-container">
                                    <div class="table appointments__table">
                                        <div class="table__headers">
                                            <div class="table__header appointments__table-header-type">
                                                Type
                                            </div>
                                            <div class="table__header appointments__table-header-num-dogs">
                                                Num. Of dogs
                                            </div>
                                            <div class="table__header appointments__table-header-made-on">
                                                Made on
                                            </div>
                                            <div class="table__header appointments__table-header-appointment-on">
                                                Appointment on
                                            </div>
                                            <div class="table__header">
                                                Status
                                            </div>
                                            <div class="table__header appointments__table-header-review">
                                                Review
                                            </div>
                                            ${Auth.currentUser.accessLevel === 1 ? html`
                                            <div class="table__header appointments__table-header-user">
                                                User
                                            </div>` : 
                                            nothing}
                                        </div>
                                        <div class="table__rows">
                                            ${this.appointments.map(appointment => html`
                                            <div class="table__row">
                                                <div class="table__cell appointments__table-cell-type">
                                                    ${this.getType(appointment.type)}
                                                </div>
                                                <div class="table__cell appointments__table-cell-num-dogs">
                                                    ${appointment.numOfDogs}
                                                </div>
                                                <div class="table__cell appointments__table-cell-made-on">
                                                    ${moment(new Date(appointment.createdAt)).format('D MMM YYYY @ HH:mm')}
                                                </div>
                                                <div class="table__cell appointments__table-cell-appointment-on">
                                                    ${moment(new Date(appointment.appointmentOn)).format('D MMM YYYY @ HH:mm')}
                                                </div>
                                                <sl-form class="table__cell appointments__table-cell-status" @sl-submit=${e => this.handleSubmitUpdateStatus(e, appointment)}>
                                                    <sl-select name="status" value="${appointment.status}" hoist ?disabled=${!this.canUpdateStatus(appointment)}>
                                                        ${this.getAuthorisedStatuses(appointment).map(status => html`
                                                        <sl-menu-item value="${status.value}">${status.displayMember}</sl-menu-item>
                                                        `)}
                                                    </sl-select>
                                                    ${this.canUpdateStatus(appointment) ? html`
                                                    <sl-button type="primary" id="status-${appointment._id.toString()}" class="appointments__table-btn-update" submit>Update</sl-button>
                                                    ` :
                                                    nothing 
                                                    }
                                                </sl-form>
                                                <div class="table__cell appointments__table-cell-review">
                                                    <sl-button @click="${e => this.handleClickManageAppointmentReviewDialog(e, appointment)}" ?disabled=${!this.canWriteReview(appointment)}>Review</sl-button>
                                                    <sl-dialog id="review-${appointment._id.toString()}" label="Review" class="dialog">
                                                        <dc-manage-appointment-review .appointment="${appointment}" .user=${Auth.currentUser} @reviewupdated=${e => this.handleClickCloseManageAppointmentReviewDialog(e, appointment)}></dc-manage-appointment-review>
                                                    </sl-dialog>
                                                </div>
                                                ${Auth.currentUser.accessLevel === 1 ? html`
                                                <div class="table__cell appointments__table-cell-user">
                                                    ${appointment.user.firstName}
                                                    <br>
                                                    ${appointment.user.lastName}
                                                    <br>
                                                    ${appointment.user.email}
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

    getManageAppointmentReviewDialog(appointment) {
        return document.getElementById(`review-${appointment._id.toString()}`)
    }

    handleClickManageAppointmentReviewDialog(e, appointment) {
        this.getManageAppointmentReviewDialog(appointment).show()
    }

    handleClickCloseManageAppointmentReviewDialog(e, appointment) {
        this.getManageAppointmentReviewDialog(appointment).hide()
        this.getAppointments(null, 0.2, 0.1)
    }

    /**
     * Handle click on button Edit
     *
     * @param {Event} e
     */
    handleClickEdit(e) {
        this.switchEditMode()
        this.render()
    }

    /**
     * Handle form submit
     *
     * @param {Event} e
     */
    async handleSubmitUpdateStatus(e, appointment) {
        e.preventDefault()
        const formData = e.detail.formData

        if (appointment.status === formData.get('status')) {
            Toast.notify(`Status already set to '${appointment.status}'`, 'info')
            return
        }

        const submitBtn = document.getElementById(`status-${appointment._id.toString()}`)
        submitBtn.setAttribute('loading', '')

        const response = await AppointmentAPI.updateStatus(appointment._id.toString(), formData)
        if (response.error) {
            Toast.notify(`Problem updating status: \n${response.error.error.message}`, 'danger')
        } else {
            Toast.notify('Status updated successfully', 'success')
        }

        submitBtn.removeAttribute('loading')
        this.getAppointments(null, 0.2, 0.1)
    }

    getAuthorisedStatuses(appointment) {
        const status = []

        switch (appointment.status) {
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

    canUpdateStatus(appointment) {
        return !(['complete', 'rejected', 'cancelled'].indexOf(appointment.status) !== -1 || (Auth.currentUser.accessLevel === 2 && 'accepted' === appointment.status))
    }

    canWriteReview(appointment) {
        return appointment.status === 'complete'
    }
}

// Export an instance of the view
export default new AppointmentsView()