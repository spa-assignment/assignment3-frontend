import { html, LitElement, css, nothing } from 'lit-element'
import AppointmentAPI from '../api/AppointmentAPI'
import Toast from '../Toast'
import { env } from '../env'

/**
 * Add product component
 */
class AddProductComponent extends LitElement {

    /**
     * Properties of the component
     */
    static get properties() {
        return {
            appointment: {
                type: Object
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
            
            .appointment-review__form-field {
                margin-top: 0;
            }
            
            .appointment-review__btn-delete-review {
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
        this.appointment = null
    }

    /**
     * Render the html content of the component
     * 
     * @returns The HTML content
     */
    render() {
        return html`
        <sl-form class="form appointment-review" @sl-submit="${e => this.handleSubmit(e)}">
            <div class="form__field appointment-review__form-field">
                ${this.appointment && this.appointment.review && this.appointment.review.image ? html`
                <img class="appointment-review__image" src="${env.apiUrlImage}/${this.appointment.review.image}">` : html`
                <div class="appointment-review__no-image"><strong>No image<br>available</strong></div>`}
            </div>
            <div class="form__field">
                <dc-input-file buttonText="Choose" placeholder="[Optional] Upload an image..."></dc-input-file>
            </div>
            <div class="form__field">
                <sl-input name="title" placeholder="Title" value="${!this.appointment || !this.appointment.review || !this.appointment.review.title ? '': this.appointment.review.title}" ?readonly=${this.user.accessLevel === 1}></sl-input>
            </div>
            <div class="form__field">
                <sl-textarea name="comment" placeholder="*Comment" required value="${!this.appointment || !this.appointment.review ? '': this.appointment.review.comment}" ?readonly=${this.user.accessLevel === 1}></sl-textarea>
            </div>
            <div class="form__field">
                <sl-rating precision=.5 value="${!this.appointment || !this.appointment.review ? 0: this.appointment.review.stars}" ?readonly=${this.user.accessLevel === 1}></sl-rating>
            </div>
            <div class="form__footer">
                ${ this.user.accessLevel === 2 ? 
                this.appointment && this.appointment.review? html`
                <sl-button class="appointment-review__btn-delete-review" @click=${e => this.handleClickDeleteReview()}>Delete</sl-button>
                <sl-button type=primary submit class="form__submit appointment-review__btn-update-review">Update</sl-button>
                ` : html`
                <sl-button type=primary submit class="form__submit appointment-review__btn-add-review">Add</sl-button>
                ` : 
                nothing }
            </div>
        </sl-form>`
    }

    async handleClickDeleteReview() {
        const deleteBtn = this.shadowRoot.querySelector('.appointment-review__btn-delete-review')
        deleteBtn.setAttribute('loading', '')

        const response = await AppointmentAPI.deleteReview(this.appointment._id.toString())
        if (response.error) {
            Toast.notify(`Problem deleting review: \n${response.error.error.message}`, 'danger')
        } else {
            Toast.notify('Review deleting successfully', 'success')
        }

        deleteBtn.removeAttribute('loading')
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
        formData.append('user', this.appointment.user._id)

        const submitBtn = this.shadowRoot.querySelector('.form__submit')
        submitBtn.setAttribute('loading', '')

        console.log(this.appointment._id.toString())

        const response = await AppointmentAPI.updateReview(this.appointment._id.toString(), formData)
        if (response.error) {
            Toast.notify(`Problem updating review: \n${response.error.error.message}`, 'danger')
        } else {
            Toast.notify('Review updated successfully', 'success')
        }

        submitBtn.removeAttribute('loading')
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
customElements.define('dc-add-product', AddProductComponent)