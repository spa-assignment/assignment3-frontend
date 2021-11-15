import { html, render, nothing } from 'lit-html'
import App from '../App'
import { goToRoute } from '../Router'
import Utils from '../Utils'
import Auth from '../Auth'
import AppointmentAPI from '../api/AppointmentAPI'

/**
 * Home view
 */
class HomeView {

    /**
     * Constructor
     */
    constructor() {
        this.abouts = []
        this.services = []
        this.reviews = []
    }

    /**
     * Initialise the view
     */
    init() {
        document.title = 'Home'
        this.render()
        Utils.fadeInFromTop('.banner')
        Utils.fadeInFromTop('.page-content')

        this.getAbouts()
        this.getServices()
        this.getReviews()
    }

    getAbouts() {
        this.abouts = [
            {
                imageUrl: 'images/dog_hug_1.jfif',
                imageAlt: 'Dog hug 1',
                description: 'We really care about your dog.',
                reversed: false,
                showAction: true
            },
            {
                imageUrl: 'images/dog_hug_2.jpg',
                imageAlt: 'Dog hug 2',
                description: 'Browse through our services for more.',
                reversed: true,
                showAction: false
            }
        ]

        this.render()
        // this.animateAbouts()
    }

    getServices() {
        this.services = [
            {
                serviceId: 1,
                imageUrl: 'images/dog_yawn.jpg',
                title: 'Check up',
                description: 'This is service Check up.',
                path: '/services/check-up'
            },
            {
                serviceId: 2,
                imageUrl: 'images/dog_yawn.jpg',
                title: 'Grooming',
                description: 'This is service Grooming.',
                path: '/services/grooming'
            },
            {
                serviceId: 1,
                imageUrl: 'images/dog_training.jpg',
                title: 'Training',
                description: 'This is service Training.',
                path: '/services/training'
            }
        ]

        this.render()
        this.animateServices()
    }

    async getReviews() {
        const response = await AppointmentAPI.getReviews()

        if(!response.error){
            const reviews = response.data.map(appointment => ({
                ...appointment.review, 
                user: appointment.user, 
                type: appointment.type,
                id: appointment._id.toString()
                }))

            const reviewsSorted = reviews.sort((a, b) => (a.stars > b.stars) ? 1 : -1)
            const topReviewCheckUp = reviewsSorted.filter(review => review.type === 'check_up')
            const topReviewGrooming = reviewsSorted.filter(review => review.type === 'grooming')
            const topReviewTraining = reviewsSorted.filter(review => review.type === 'training')
            
            const topReviews = []
            let topReviewsRunnerUp = reviewsSorted

            if (topReviewCheckUp.length > 0) {
                topReviews.push(topReviewCheckUp[0])
                topReviewsRunnerUp = topReviewsRunnerUp.filter(review => review.id !== topReviewCheckUp[0].id)
            }

            if (topReviewGrooming.length > 0) {
                topReviews.push(topReviewGrooming[0])
                topReviewsRunnerUp = topReviewsRunnerUp.filter(review => review.id !== topReviewGrooming[0].id)
            }

            if (topReviewTraining.length > 0) {
                topReviews.push(topReviewTraining[0])
                topReviewsRunnerUp = topReviewsRunnerUp.filter(review => review.id !== topReviewTraining[0].id)
            }

            topReviewsRunnerUp = topReviewsRunnerUp.sort((a, b) => (a.stars > b.stars) ? 1 : -1)

            for (let index = 0; index < topReviewsRunnerUp.length; index++) {
                topReviews.push(topReviewsRunnerUp[index])
            }
            
            this.reviews = topReviews.splice(0, 3)
            
            this.render()
            // this.animateReviews()
        }
    }

    animateAbouts() {
        Utils.fadeInFromCenterOnScrollStaggered('.about', '.about__items')
    }

    animateServices() {
        Utils.fadeInFromCenterOnScrollStaggered('.services__items', '.services__item', "top center")
    }

    animateReviews() {
        Utils.fadeInFromCenterOnScrollStaggered('.reviews__items', '.reviews__item', "top top")
    }

    /**
     * Render the view
     */
    render() {
        const template = html`
        <dc-header title="Home" user=${JSON.stringify(Auth.currentUser)}></dc-header>
        <div class="page-content-container">
            <div class="banner">
                <img src="images/dog_banner.jpg" alt="Banner image" class="banner__image">
                <div class="banner__content">
                    <div class="banner__text">
                        <div class="banner__heading">
                            Dog
                            <br />
                            Care
                        </div>
                        We take care for your Dog.
                        <br />
                        Browse through our services and advices for more.
                    </div>
                </div>
            </div>
            <div class="page-content page-content--horizontal-align--center page-content--offset--down">
                <div class="view-home">
                    <div class="view-home__content view-home__about about">
                        <div class="about__items">
                            ${this.abouts.map(about => html`
                            <div class="about__item ${about.reversed ? 'about__item--reverse' : nothing}">
                                <div class="about__item-image-container">
                                    <img src="${about.imageUrl}" alt="${about.imageAlt}" class="about__item-image">
                                </div>
                                <div class="about__item-text">
                                    ${about.description}
                                    ${about.showAction ? html`
                                    <div class="about__item-action">
                                        <sl-button type="primary" @click=${() => goToRoute('/about')}>Read more</sl-button>
                                    </div>
                                    ` : nothing}
                                </div>
                            </div>
                            `)}                   
                        </div>
                    </div>
                    <div class="view-home__content view-home__services services">
                        <div class="services__heading">
                            Services
                        </div>
                        <div class="services__items">
                            ${this.services.map(service => html`
                            <div class="services__item">
                                <sl-avatar class="services__item-image" image="${service.imageUrl}"></sl-avatar>
                                <div class="services__item-content">
                                    <div class="services__item-text">
                                        <div class="services__item-heading">
                                            ${service.title}
                                        </div>
                                        ${service.description}
                                    </div>
                                    <div class="services__item-action">
                                        <sl-button type="primary" @click=${() => this.handleClickService(service.path)}>Book now</sl-button>
                                    </div>
                                </div>
                            </div>`)}
                        </div>
                    </div>
                    <div class="view-home__content view-home__reviews reviews">
                        <div class="reviews__heading">
                            Reviews
                        </div>
                        <div class="reviews__items">
                            ${this.reviews.map(review => html`
                            <div class="reviews__item">
                                <div class="reviews__item-heading">
                                    ${review.title}
                                </div>
                                <br />
                                ${review.comment}
                                <br />
                                <br />
                                <strong>${review.user.firstName} ${review.user.lastName}</strong>
                            </div>
                            `)}
                        </div>
                    </div>
                </div>    
            </div>
        </div>
        <dc-footer></dc-footer>
        `
        render(template, App.rootEl)
    }

    /**
     * Handle the click on a service
     * 
     * @param {string} path 
     */
    handleClickService(path) {
        // const params = new URLSearchParams({
        //     serviceId: serviceId,
        // })

        // goToRoute(`/service?${params.toString()}`)
        goToRoute(path)
    }
}

// Export an instance of the view
export default new HomeView()