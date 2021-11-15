import { html, render } from 'lit-html'
import App from '../App'
import Auth from '../Auth'
import { anchorRoute, goToRoute } from '../Router'
import Toast from '../Toast'
import Utils from '../Utils'

/**
 * Sign up view
 */
class SignUpView {

    /**
     * Initialise the view
     */
    init() {
        document.title = 'Sign Up'
        this.render()
        Utils.fadeInFromTop('.page-content')
    }

    /**
     * Render the view
     */
    render() {
        const template = html`
        <div class="page-content-container page-content-container--vertical-align--center">
            <div class="page-content page-content--horizontal-align--center">
                <div class="sign-up-image"></div>
                <div class="view-sign-up">
                    <div class="sign-up">
                        <div class="sign-up__heading">
                            Sign up
                        </div>
                        <sl-form class="form" @sl-submit=${e => this.handleSubmit(e)}>
                            <div class="form__field form__field--offset-top--none">
                                <div class="form__field-label">
                                    First name:
                                </div>
                                <sl-input type="text" name="firstName" placeholder="First name" required></sl-input>
                            </div>
                            <div class="form__field">
                                <div class="form__field-label">
                                    Last name:
                                </div>
                                <sl-input type="text" name="lastName" placeholder="Last name" required></sl-input>
                            </div>
                            <div class="form__field">
                                <div class="form__field-label">
                                    Email:
                                </div>
                                <sl-input type="email" name="email" placeholder="Email" required></sl-input>
                            </div>
                            <div class="form__field">
                                <div class="form__field-label">
                                    Password:
                                </div>
                                <sl-input type="password" name="password" placeholder="Password" required toggle-password></sl-input>
                            </div>
                            <div class="form__footer">
                                <sl-button type="primary" submit class="form__submit">Sign up</sl-button>
                            </div>
                        </sl-form>
                        <p class="sign-up__sign-in">Have an account? <a href="/signin" @click="${anchorRoute}">Sign in</a></p>
                    </div>
                </div>
            </div>
        </div>
        `
        render(template, App.rootEl)
    }

    /**
     * Submit sign in
     * 
     * @param {Event} e Event 
     */
    async handleSubmit(e) {
        e.preventDefault()
        const formData = e.detail.formData
        const submitBtn = document.querySelector('.form__submit')
        submitBtn.setAttribute('loading', '')

        // sign in using Auth
        const response = await Auth.signUp(formData)
        submitBtn.removeAttribute('loading')

        if(response.error){
            Toast.notify(`Problem signing up: ${response.error.error.message}`, 'danger')
        } else {
            Toast.notify('Account created, please sign in', 'success')
            goToRoute('/signin')
        }
    }
}

// Export an instance of the view
export default new SignUpView()