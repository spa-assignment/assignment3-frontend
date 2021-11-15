import App from './App'

// styles
import './scss/master.scss'

// components (custom web components)
import './components/HeaderComponent'
import './components/FooterComponent'
import './components/InputFileComponent'
import './components/BookAppointmentComponent'
import './components/ManageAppointmentReviewComponent'
import './components/ManageProductsReviewComponent'
import './components/CartComponent'
import './components/AddProductComponent'

// app.init
document.addEventListener('DOMContentLoaded', () => App.init())