import { LitElement, html, css } from 'lit-element'

/**
 * Input file component
 */
class InputFileComponent extends LitElement {

    /**
     * Properties of the component
     */
    static get properties() {
        return {
            buttonText: {
                type: String
            },
            placeholder: {
                type: String
            },
            value: {
                type: Object
            },
            disabled: {
                type: Boolean
            },
            alignVertical: {
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
            }

            .dc-file {
                display: flex;
                width: auto;
            }

            .dc-file--align-vertical {
                display: flex;
                width: auto;
                height: auto;
                flex-direction: column;
            }

            /* 
                hiding the <input>
                CSS properties such as display: none or visibility: hidden are not used 
                because it will exclude the <input> out of tab order.
                Thus the following combinations are used to hide the <input> visually
                but keeping it visible for the browser 
            */
            .dc-file__input-file {
                width: 0.1px;
                height: 0.1px;
                opacity: 0;
                overflow: hidden;
                position: absolute;
                z-index: -1;
            }

            .dc-file__display-file {
                flex: 1;
                width: 100%;
                min-width: 0;
            }
            
            .dc-file__button {
                margin-left: .5em;
            }

            .dc-file__button--disabled {
                cursor: not-allowed;
            }

            .dc-file__button--align-vertical {
                margin-left: 0;
                margin-top: 0.5em;
            }

            .dc-button {
                display: inline-flex;
                align-items: stretch;
                justify-content: center;
                width: 100%;
                border-style: solid;
                border-width: var(--sl-input-border-width);
                font-family: var(--sl-input-font-family);
                font-weight: var(--sl-font-weight-semibold);
                text-decoration: none;
                user-select: none;
                white-space: nowrap;
                vertical-align: middle;
                padding: 0;
                cursor: pointer;
                transition: var(--sl-transition-fast) background-color, 
                            var(--sl-transition-fast) color,
                            var(--sl-transition-fast) border, var(--sl-transition-fast) box-shadow;
            }
            
            .dc-button * {
                pointer-events: none;
            }

            .dc-button:focus {
                outline: none;
            }

            .dc-button--primary {
                background-color: rgb(var(--sl-color-primary-500));
                border-color: rgb(var(--sl-color-primary-500));
                color: rgb(var(--sl-color-neutral-0));
            }
            
            .dc-button--primary:hover {
                background-color: rgb(var(--sl-color-primary-400));
                border-color: rgb(var(--sl-color-primary-400));
                color: rgb(var(--sl-color-neutral-0));
            }

            .dc-button--primary:focus {
                background-color: rgb(var(--sl-color-primary-400));
                border-color: rgb(var(--sl-color-primary-400));
                color: rgb(var(--sl-color-neutral-0));
                box-shadow: 0 0 0 var(--sl-focus-ring-width) rgb(var(--sl-focus-ring-color-primary));
            }

            .dc-button--primary:active {
                background-color: rgb(var(--sl-color-primary-500));
                border-color: rgb(var(--sl-color-primary-500));
                color: rgb(var(--sl-color-neutral-0));
            }

            .dc-button--medium {
                font-size: var(--sl-button-font-size-medium);
                height: var(--sl-input-height-medium);
                line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
                border-radius: var(--sl-input-border-radius-medium);
                padding-left: var(--sl-spacing-small);
                padding-right: var(--sl-spacing-small);
            }

            .dc-button--disabled {
                cursor: not-allowed;
                opacity: 0.5;
                pointer-events: none;
            }
            `
        ]
    }

    /**
     * Constructor
     */
    constructor() {
        super()

        // initialize default values
        this.buttonText = 'Choose a file'
        this.placeholder = 'No file chosen ...'
        this.disabled = false
        this.alignVertical = false
    }

    /**
     * Render the html content of the component
     * 
     * @returns The HTML content
     */
    render() {
        return html`
        <div class="dc-file ${this.alignVertical ? 'dc-file--align-vertical' : ''}">
            <!-- actual file input -->
            <input type="file" 
                id="file"
                class="dc-file__input-file" 
                @change="${this.handleFileChange}" ?disabled="${this.disabled}"/>

            <!-- name of file chosen -->
            <sl-input type="text"
                class="dc-file__display-file" 
                placeholder="${this.placeholder}" 
                readonly 
                clearable
                @sl-clear="${this.handleClear}" ?disabled="${this.disabled}"></sl-input>

            <!-- custom file input button -->
            <div class="dc-file__button ${this.disabled ? 'dc-file__button--disabled': ''} ${this.alignVertical ? 'dc-file__button--align-vertical': ''}">
                <label for="file" class="dc-button dc-button--primary dc-button--medium ${this.disabled ? 'dc-button--disabled': ''}">
                    <span>${this.buttonText}</span>
                </label>
            </div>
        </div>
        `
    }

    /**
     * Emit custom event from component when a file is chosen
     * 
     * @param {event} e Event
     */
    handleFileChange(e) {
        // get the file chosen
        this.value = e.target.files[0]
        
        const fileName = e.target.value.split( '\\' ).pop()
        const fileChosenEl = this.shadowRoot.querySelector('.dc-file__display-file')
        fileChosenEl.value = fileName

        // create the custom event
        const fileChangeEvent = new CustomEvent('filechange', {
            detail: {
                file: this.value
            }
        })

        // emit the custom event
        this.dispatchEvent(fileChangeEvent)
    }

    /**
     * Emit custom event on file chosen clear
     * 
     * @param {event} e Event
     */
    handleClear(e) {
        this.value = null

        // create the custom event
        const fileChangeEvent = new CustomEvent('filechange', {
            detail: {
                file: this.value
            }
        })

        // emit the custom event
        this.dispatchEvent(fileChangeEvent)
    }

    /**
     * Clear the element value
     */
    clear() {
        const fileChosenEl = this.shadowRoot.querySelector('.dc-file__display-file')
        fileChosenEl.value = ''
        this.handleClear()
    }
}

// Create the component
customElements.define('dc-input-file', InputFileComponent)