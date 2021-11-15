import { html, render } from 'lit-html'
import App from '../App'
import Utils from '../Utils'
import Auth from '../Auth'
import UserAPI from '../api/UserAPI'
import Toast from '../Toast'
import { env } from '../env'

/**
 * Account view
 */
class AccountView {

    /**
     * Constructor
     */
    constructor() {
        this.user = null
        this.editMode = false
        this.editTextBtn = "Edit"
    }

    /**
     * Initialise the view
     */
    init() {
        document.title = 'Account'
        this.render()
        Utils.fadeInFromTop('.page-content')
        this.getUser()
    }

    async getUser() {
        const response = await UserAPI.getUser(Auth.currentUser._id.toString())

        if(response.error){
            Toast.notify(`Problem fetching user: \n${response.error.error.message}`, 'danger')
            this.user = null
        } else {
            this.user = response.data
        }

        this.render()
    }

    /**
     * Render the view
     */
    render() {
        const template = html`
        <dc-header title="Account" user=${JSON.stringify(Auth.currentUser)}></dc-header>
        <div class="page-content-container page-content-container--footer">
            <div class="page-content page-content--horizontal-align--center page-content--offset--top">
                <div class="view-account">
                    ${this.user && this.user.avatar ? html`
                    <sl-avatar class="account-avatar" image="${env.apiUrlImage}/${this.user.avatar}"></sl-avatar>`
                    : html`<sl-avatar class="account-avatar"></sl-avatar>`}
                    <sl-form class="form account" @sl-submit=${(e) => this.handleSubmit(e)}>
                        <div class="form__field account__form-field">
                            <div class="form__field-label">
                                Avatar:
                            </div>
                            <dc-input-file buttonText="Change avatar" placeholder="No avatar choosen..." ?disabled="${!this.editMode}"></dc-input-file>
                        </div>
                        <div class="form__field account__form-field">
                            <div class="form__field-label">
                                First name:
                            </div>
                            <sl-input type="text" name="firstName" value="${this.user ? this.user.firstName : ''}" ?disabled="${!this.editMode}"></sl-input>
                        </div>
                        <div class="form__field">
                            <div class="form__field-label">
                                Last name:
                            </div>
                            <sl-input type="text" name="lastName" value="${this.user ? this.user.lastName : ''}" ?disabled="${!this.editMode}"></sl-input>
                        </div>
                        <div class="form__field">
                            <div class="form__field-label">
                                Email:
                            </div>
                            <sl-input type="text" name="email" value="${this.user ? this.user.email : ''}" ?disabled="${!this.editMode}"></sl-input>
                        </div>
                        <div class="form__field">
                            <div class="form__field-label">
                                Phone number:
                            </div>
                            <sl-input type="tel" name="phoneNumber" value="${this.user && this.user.phoneNumber ? this.user.phoneNumber : ''}" ?disabled="${!this.editMode}"></sl-input>
                        </div>
                        <div class="form__field">
                            <div class="form__field-label">
                                Address:
                            </div>
                            <sl-textarea name="address" value="${this.user && this.user.address ? this.user.address : ''}" ?disabled="${!this.editMode}"></sl-textarea>
                        </div>
                        <div class="form__footer">
                            <sl-button class="account__btn-edit" @click="${(e) => this.handleClickEdit(e)}">${this.editTextBtn}</sl-button>
                            <sl-button type="primary" submit class="form__submit" ?disabled="${!this.editMode}">Save</sl-button>
                        </div>
                    </sl-form>
                </div>    
            </div>
        </div>
        <dc-footer fixedFooter></dc-footer>
        `
        render(template, App.rootEl)
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
    async handleSubmit(e) {
        e.preventDefault()
        const formData = e.detail.formData

        // get the value of the file chosen
        // NOTE: this value has to be set manually because <sl-form> does not recognise <pc-input-file>
        // as thus cannot retrieve its value automatically
        const pcInputFileEl = document.querySelector('dc-input-file')
        if (pcInputFileEl.value) {
            formData.append('avatar', pcInputFileEl.value)
        }

        const submitBtn = document.querySelector('.form__submit')
        submitBtn.setAttribute('loading', '')

        const response = await UserAPI.updateUser(this.user._id.toString(), formData)
        if (response.error) {
            Toast.notify(`Problem updating user: \n${response.error.error.message}`, 'danger')
        } else {
            Toast.notify('User updated successfully', 'success')
            pcInputFileEl.clear()

            this.switchEditMode()
            this.getUser()
        }

        submitBtn.removeAttribute('loading')
    }

    switchEditMode() {
        this.editMode = !this.editMode
        this.editTextBtn = this.editMode ? "Cancel" : "Edit"
    }
}

// Export an instance of the view
export default new AccountView()