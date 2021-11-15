import { gsap } from 'gsap';

export default class Toast {
    static init() {
        // create container element
        this.containerEl = document.createElement('div');
        this.containerEl.className = 'toasts';
        // append to <body>
        document.body.appendChild(this.containerEl);
    }

    /**
     * Emit toast notifications
     *
     * @param {string} message Message to show
     * @param {string} type Type of notification (info, success, warning, danger)
     * @param {number} duration Duration of notification (-1: always displayed)
     */
    static notify(message, type = 'info', duration = 2500) {
        if (!message) return;

        // create element
        const toastEl = document.createElement('div');
        toastEl.className = 'toast';

        // determine the toast type css class 
        if (['info', 'success', 'warning', 'danger'].indexOf(type) === -1) {
            type = 'info'
        }

        // determine the icon to use
        let icon = 'info-circle'
        switch (type) {
            case 'success':
                icon = 'check2-circle'
                break;
            
            case 'warning':
                icon = 'exclamation-triangle'
                break

            case 'danger':
                icon = 'exclamation-octagon'
                break
        }

        toastEl.innerHTML = `
        <sl-progress-bar class="toast__progress-bar progress-bar--${type}" percentage="100"></sl-progress-bar>
        <div class="toast__content">
            <div>
                <sl-icon name='${icon}' slot='icon' class="icon toast__icon toast__icon--${type}"></sl-icon>
            </div>
            <div class="toast__message">
                ${Toast.escapeHtml(message)}
            </div>
            <div class="toast__action">
                <sl-icon name='x-circle' slot='icon' class="icon toast__icon"></sl-icon>
            </div>
        </div>
        `

        // append to toasts container
        this.containerEl.appendChild(toastEl)

        // tween variable for closing toast
        const tweenVarsClose = { 
            marginTop: -(toastEl.getBoundingClientRect().height), 
            opacity: 0, 
            duration: 0.3, 
            onComplete: () => toastEl.remove()
        }

        // animate toast using gsap when closing the toast
        const toastIconeCloseEl = toastEl.querySelector('.toast__action')
        toastIconeCloseEl.addEventListener('click', () => gsap.timeline().to(toastEl, tweenVarsClose))

        // animate toast using gsap
        const timeline = gsap.timeline() 

        // make toast visible
        timeline.from(toastEl, { y: 60, opacity: 0, duration: 0.3, ease: "power3.out" })

        // animate toast progress bar
        timeline.to(toastEl, { 
            duration: (duration / 1000),
            onUpdate: function() {
                const toastProgressBarEl = toastEl.querySelector('.toast__progress-bar')
                toastProgressBarEl.percentage = 100 - (this.progress() * 100)
            }
        })

        // animate toast closing
        timeline.to(toastEl, tweenVarsClose, "+=0.3")
    }

    /**
     * Escape HTML for text arguments
     * 
     * @param {string} html 
     * 
     * @returns The HTML content
     */
    static escapeHtml(html) {
        const div = document.createElement('div')

        const content = html.split('\n')
        let innerHTML = content[0]

        for (let index = 1; index < content.length; index++) {
            innerHTML += `<br>${content[index]}`
        }

        div.innerHTML = innerHTML
        return div.innerHTML
    }
}