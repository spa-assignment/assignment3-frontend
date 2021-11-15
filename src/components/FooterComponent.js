import { html, LitElement, css } from 'lit-element'
import { nothing } from 'lit-html'

/**
 * Footer component
 */
class FooterComponent extends LitElement {

    /**
     * Properties of the component
     */
    static get properties() {
        return {
            fixedFooter: {
                type: Boolean
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

            .footer {
                margin-top: auto;
                margin-bottom: 0;
                padding: 1rem;
                background-color: rgb(58, 84, 180);
            }

            .footer--position--bottom {
                margin-top: 1rem;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
            }

            .footer__social {
                display: flex;
                justify-content: center;
                font-size: 1.5rem;
            }

            .footer__icon {
                margin: 0 1rem;
            }`
        ]
    }

    /**
     * Constructor
     */
    constructor() {
        super()
        this.fixedFooter = false
    }

    /**
     * Render the html content of the component
     * 
     * @returns The HTML content
     */
    render() {
        return html`
        <!-- <footer class="footer ${this.fixedFooter ? 'footer--position--bottom' : nothing}"> -->
        <footer class="footer">
            <div class="footer__image"></div>
            <div class="footer__social">
                <sl-icon name="facebook" class="footer__icon"></sl-icon>
                <sl-icon name="instagram" class="footer__icon"></sl-icon>
                <sl-icon name="linkedin" class="footer__icon"></sl-icon>
            </div>
        </footer>`
    }
}

// Create the component
customElements.define('dc-footer', FooterComponent)