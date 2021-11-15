
import { html, render } from 'lit-html'
import App from '../App'
import Utils from '../Utils'
import Auth from '../Auth'
import AppointmentAPI from '../api/AppointmentAPI'
import Toast from '../Toast'
import { env } from '../env'

/**
 * Service check up view
 */
class ServiceCheckUpView {

    /**
     * Constructor
     */
    constructor() {
        this.description = `Book a check-up appointment for your dog. Choose a date and book an appoitment. Attend the appointment. And leave a review when the appointment is completed.`;

        this.steps = [
            {
                icon: 'search',
                header: '1. Book an appointment',
                description: 'Choose a date and book an appointment'
            },
            {
                icon: 'people',
                header: '2. Attend appointment',
                description: 'Attend the appointment on the date specified'
            },
            {
                icon: 'chat-right-text',
                header: '3. Leave review',
                description: 'After the appointment leave a review :)'
            }
        ]

        this.reviews = []
    }

    /**
     * Initialise the view
     */
    init() {
        document.title = 'Check-up'
        this.render()
        const timeline = Utils.fadeInFromTop('.page-content')
        this.getReviews(timeline)
    }

    async getReviews(timeline=null, duration=0.5, stagger=0.3) {
        const response = await AppointmentAPI.getReviews('check_up')

        if(response.error){
            Toast.notify(`Problem fetching reviews: \n${response.error.error.message}`, 'danger')
        } else {
            this.reviews = response.data.map(appointment => ({...appointment.review, user: appointment.user}))
            if (this.reviews.length === 0) {
                Toast.notify(`No reviews available`, 'success')
            } else {
                Toast.notify(`${this.reviews.length} reviews fetched`, 'success')
            }
            
            this.render()
            Utils.fadeInFromTopStaggered('.service__review', timeline, duration, stagger)
        }
    }

    /**
     * Render the view
     */
    render() {
        const template = html`
        <dc-header title="Ckeck-up" user=${JSON.stringify(Auth.currentUser)}></dc-header>
        <div class="page-content-container page-content-container--footer">
            <div class="page-content page-content--horizontal-align--center page-content--offset--top-small">
                <div class="view-service-check-up service">
                    <div class="service__heading">
                        Check-up
                    </div>
                    <div class="service__content">
                        <div class="service__description">
                            ${this.description}
                        </div>
                        <div class="service__steps-container">
                            <div class="service__steps-header">
                                Steps
                                <hr>
                            </div>
                            <div class="service__steps">
                                ${this.steps.map(step => html`
                                <div class="service__step">
                                    <div class="service__step-header">
                                        <sl-icon name="${step.icon}" class="service__step-icon"></sl-icon>
                                        <h4>${step.header}</h4>
                                    </div>
                                    ${step.description}
                                </div>
                                `)}
                            </div>
                        </div>
                        <div class="service__book">
                            <sl-button type="primary" @click="${e => this.handleClickBookAppointmentDialog(e)}">Book appointment</sl-button>
                            <sl-dialog label="Check up" class="dialog">
                                <dc-book-appointment type='check_up' .user=${Auth.currentUser}></dc-book-appointment>
                            </sl-dialog>
                        </div>
                        <div class="service__reviews-container">
                            <div class="service__reviews-header">
                                Reviews
                                <hr>
                            </div>
                            <div class="service__reviews">
                                ${!this.reviews || this.reviews.length === 0 ? html`
                                No reviews available` : 
                                this.reviews.map(review => html`
                                <sl-card class="service__review">
                                    <div class="card-image service__review-content">
                                        <div class="card-image__image-container service__review-image-container">
                                            ${review.image ? html`
                                            <img class="service__review-image" src="${env.apiUrlImage}/${review.image}">` : html`
                                            <div class="service__review-no-image"><strong>No image<br>available</strong></div>`}
                                        </div>
                                        <div class="card-image__text service__review-text">
                                            <div class="service__review-heading">
                                                ${review.title}
                                            </div>
                                            ${review.comment}
                                            <br>
                                            <br>
                                            By : ${review.user.firstName} ${review.user.lastName}
                                        </div>
                                    </div>
                                    <div slot="footer">
                                        <sl-rating precision=".5" value="${review ? review.stars : 0}" class="service__review-rating" readonly></sl-rating>
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

    handleClickBookAppointmentDialog(e) {
        const dialogEl = document.querySelector('.dialog')
        dialogEl.show()
    }
}

// Export an instance of the view
export default new ServiceCheckUpView()