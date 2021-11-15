import { html, render } from 'lit-html'
import App from '../App'
import Utils from '../Utils'
import Auth from '../Auth'

/**
 * About view
 */
class AboutView {

    /**
     * Initialise the view
     */
    init() {
        document.title = 'About'
        this.render()
        Utils.fadeInFromTop('.page-content')
    }

    /**
     * Render the view
     */
    render() {
        const template = html`
        <dc-header title="About" user=${JSON.stringify(Auth.currentUser)}></dc-header>
        <div class="page-content-container page-content-container--footer">
            <div class="page-content page-content--horizontal-align--center page-content--offset--top">
                <div class="view-about about">
                    <sl-avatar class="about__image" image="images/dog_grass.jpg"></sl-avatar>
                    <div class="about__text">
                        <div class="about__heading">
                            About
                        </div>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing 
                            and typesetting industry. Lorem Ipsum has been the 
                            industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and 
                            scrambled it to make a type specimen book. 
                            It has survived not only five centuries, 
                            but also the leap into electronic typesetting,
                            remaining essentially unchanged.

                            <br />
                            <br />
                            Lorem Ipsum is simply dummy text of the printing 
                            and typesetting industry. Lorem Ipsum has been the 
                            industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and 
                            scrambled it to make a type specimen book. 
                            It has survived not only five centuries, 
                            but also the leap into electronic typesetting,
                            remaining essentially unchanged.
                        </p>
                    </div>
                </div>    
            </div>
        </div>
        <dc-footer fixedFooter></dc-footer>
        `
        render(template, App.rootEl)
    }
}

// Export an instance of the view
export default new AboutView()