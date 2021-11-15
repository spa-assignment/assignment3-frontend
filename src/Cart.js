import { env } from './env'

/**
 * Class to handle cart
 */
class Cart {

    /**
     * Constructor
     */
    constructor() {
        this.cart = []
    }

    async getCart(userId) {
        try {
            const response = await fetch(`${env.apiUrl}/users/${userId}/cart`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.dcAccessToken}`
                }
            })

            if (!response.ok) {
                const err = await response.json() ?? {
                    error: {
                        type: 'api_no_err_message',
                        message: 'The cart data could not be fetched.'
                    }
                }

                return this.complete(null, err)
            }

            const data = await response.json()
            this.cart = data
            return this.complete(data, null)
        } catch (error) {
            return this.complete(null, { 
                error: {
                    type: 'client',
                    message: 'Error fetching cart data',
                    detail: error
                }
            })
        }
    }

    async addItem(userId, formData) {
        try {
            const response = await fetch(`${env.apiUrl}/users/${userId.toString()}/cart`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.dcAccessToken}`
                },
                body: formData
            })

            if (!response.ok) {
                const err = await response.json() ?? {
                    error: {
                        type: 'api_no_err_message',
                        message: 'The cart data could not be updated.'
                    }
                }

                return this.complete(null, err)
            }

            const data = await response.json()
            return this.complete(data, null)
        } catch (error) {
            return this.complete(null, { 
                error: {
                    type: 'client',
                    message: 'Error updating cart data',
                    detail: error
                }
            })
        }
    }

    async removeItem(userId, cartItem) {
        console.log(userId, cartItem)
        try {
            const response = await fetch(`${env.apiUrl}/users/${userId}/cart/products/${cartItem.product._id.toString()}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.dcAccessToken}`
                }
            })

            if (!response.ok) {
                const err = await response.json() ?? {
                    error: {
                        type: 'api_no_err_message',
                        message: 'The cart data could not be updated.'
                    }
                }

        console.log('1')
                return this.complete(null, err)
            }

        console.log('1')
            const data = await response.json()
            return this.complete(data, null)
        } catch (error) {
            return this.complete(null, { 
                error: {
                    type: 'client',
                    message: 'Error updating cart data',
                    detail: error
                }
            })
        }
    }

    /**
     * Complete a request.
     * 
     * @param {any} data 
     * @param {any} error 
     * 
     * @returns The response
     */
    complete(data, error) {
        const response = { data: data, error: error }
        return response
    }
}

// export an instance of cart
export default new Cart()