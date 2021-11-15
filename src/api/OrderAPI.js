import {
    env
} from '../env'

class OrderAPI {

    async addOrder(formData) {
        try {
            const response = await fetch(`${env.apiUrl}/orders`, {
                method: 'POST',
                body: formData,
                headers: { 'Authorization': `Bearer ${localStorage.dcAccessToken}` }
            })

            if (!response.ok) {
                const err = await response.json() ?? {
                    error: {
                        type: 'api_no_err_message',
                        message: 'The data could not be processed.'
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
                    message: 'Error adding order',
                    detail: error
                }
            })
        }
    }

    async getOrder(orderId) {
        try {
            const response = await fetch(`${env.apiUrl}/orders/${orderId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.dcAccessToken}` }
            })

            if (!response.ok) {
                const err = await response.json() ?? {
                    error: {
                        type: 'api_no_err_message',
                        message: 'The data could not be processed.'
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
                    message: 'Error getting order',
                    detail: error
                }
            })
        }
    }

    async getOrders(userId=null) {
        try {
            const response = await fetch(`${env.apiUrl}/orders${userId ? `/user/${userId}` : ''}`, {
                headers: { 'Authorization': `Bearer ${localStorage.dcAccessToken}` }
            })

            if (!response.ok) {
                const err = await response.json() ?? {
                    error: {
                        type: 'api_no_err_message',
                        message: 'The data could not be processed.'
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
                    message: 'Error getting orders',
                    detail: error
                }
            })
        }
    }

    async getReviews(productId) {
        try {
            const response = await fetch(`${env.apiUrl}/orders/reviews/${productId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.dcAccessToken}` }
            })

            if (!response.ok) {
                const err = await response.json() ?? {
                    error: {
                        type: 'api_no_err_message',
                        message: 'The data could not be processed.'
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
                    message: 'Error getting reviews',
                    detail: error
                }
            })
        }
    }

    async updateStatus(orderId, formData) {
        try {
            const response = await fetch(`${env.apiUrl}/orders/${orderId}/status`, {
                method: 'PUT',
                body: formData,
                headers: { 'Authorization': `Bearer ${localStorage.dcAccessToken}` }
            })

            if (!response.ok) {
                const err = await response.json() ?? {
                    error: {
                        type: 'api_no_err_message',
                        message: 'The data could not be processed.'
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
                    message: 'Error updating order',
                    detail: error
                }
            })
        }
    }

    async updateReview(orderId, productId, formData) {
        try {
            const response = await fetch(`${env.apiUrl}/orders/${orderId}/products/${productId}/review`, {
                method: 'PUT',
                body: formData,
                headers: { 'Authorization': `Bearer ${localStorage.dcAccessToken}` }
            })

            if (!response.ok) {
                const err = await response.json() ?? {
                    error: {
                        type: 'api_no_err_message',
                        message: 'The data could not be processed.'
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
                    message: 'Error updating order',
                    detail: error
                }
            })
        }
    }

    async deleteReview(orderId, productId) {
        try {
            const response = await fetch(`${env.apiUrl}/orders/${orderId}/products/${productId}/review`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.dcAccessToken}` }
            })

            if (!response.ok) {
                const err = await response.json() ?? {
                    error: {
                        type: 'api_no_err_message',
                        message: 'The data could not be processed.'
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
                    message: 'Error updating order',
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
        const response = {
            data: data,
            error: error
        }
        console.log(response)
        return response
    }
}

export default new OrderAPI()