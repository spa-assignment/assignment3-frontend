import { html, render } from 'lit-html'
import App from '../App'
import { anchorRoute } from '../Router'

/**
 * 404 view
 */
class PageNotFoundView {

    /**
     * Initialise the view
     */
    init() {
        document.title = '404 Page not found'
        this.render()
    }

    /**
     * Render the view
     */
    render() {
        const template = html`
        <div class="page-content-container">
            <div class="page-content page-content--horizontal-align--center">
                <h1>Opps</h1>
                <p>Sorry, page not found!</p>
                <a href="/" @click=${anchorRoute}>Back to Home</a>
            </div>
        </div>
        `
        render(template, App.rootEl)
    }
}

// Export an instance of the view
export default new PageNotFoundView()