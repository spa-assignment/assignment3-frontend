import {
    html,
    LitElement,
    css
} from 'lit-element'
import AppointmentAPI from '../api/AppointmentAPI'
import Toast from '../Toast'
import moment from 'moment'

/**
 * Book appointment component
 */
class BookAppointmentComponent extends LitElement {

    /**
     * Properties of the component
     */
    static get properties() {
        return {
            type: {
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
            
            .appointment__form-field {
                margin-top: 0;
            }`
        ]
    }

    /**
     * Render the html content of the component
     * 
     * @returns The HTML content
     */
    render() {
        return html `
        <sl-form class="form appointment" @sl-submit="${e => this.handleSubmit(e)}">
            <div class="form__field appointment__form-field">
                <div class="form__field-label">
                    Number of dogs:
                </div>
                <sl-input id="num-of-dogs" type="number" name="numOfDogs" value="1" min="1" max="5" required></sl-input>
            </div>
            <div class="form__field">
                <div class="form__field-label">
                    Appointment date:
                </div>
                <sl-input id="appointment-date" type="date" name="appointmentDate" required></sl-input>
            </div>
            <div class="form__field">
                <div class="form__field-label">
                    Appointment time:
                </div>
                <sl-input id="appointment-time" type="time" name="appointmentTime" required></sl-input>
            </div>
            <div class="form__footer">
                <sl-button type="primary" submit class="form__submit">Book</sl-button>
            </div>
        </sl-form>`
    }

    /**
     * Submit sign in
     * 
     * @param {Event} e Event 
     */
    async handleSubmit(e) {
        e.preventDefault()
        const formData = e.detail.formData

        const appointmentOn = new Date(`${formData.get('appointmentDate')} ${formData.get('appointmentTime')}`)

        if (appointmentOn < new Date()) {
            Toast.notify('Invalid appointment date and time\nValue should be greater than current date and time', 'danger')
            return
        }

        formData.append('type', this.type)
        formData.append('appointmentOn', appointmentOn)
        formData.append('user', this.user._id)
        formData.delete('appointmentDate')
        formData.delete('appointmentTime')

        const submitBtn = this.shadowRoot.querySelector('.form__submit')
        submitBtn.setAttribute('loading', '')

        const response = await AppointmentAPI.addAppointment(formData)
        if (response.error) {
            Toast.notify(`Problem booking appointment: \n${response.error.error.message}`, 'danger')
        } else {
            Toast.notify(`Appointment booked successfully\nType: ${this.getType()}\nAt: ${moment(appointmentOn).format('Do MMMM YYYY, @ h:mm a')}`, 'success', 5000)

            this.shadowRoot.getElementById('num-of-dogs').value = 1
            this.shadowRoot.getElementById('appointment-date').value = ''
            this.shadowRoot.getElementById('appointment-time').value = ''
        }

        submitBtn.removeAttribute('loading')
    }

    getType() {
        switch (this.type) {
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
}

// Create the component
customElements.define('dc-book-appointment', BookAppointmentComponent)