import {
    env
} from '../env'

class ProductsAPI {

    async addProduct(formData) {
        try {
            const response = await fetch(`${env.apiUrl}/products`, {
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
                    message: 'Error adding product',
                    detail: error
                }
            })
        }
    }

    async getProducts() {
        try {
            const response = await fetch(`${env.apiUrl}/products`, {
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
                    message: 'Error getting products',
                    detail: error
                }
            })
        }
    }

    async getProduct(productId) {
        try {
            const response = await fetch(`${env.apiUrl}/products/${productId}`, {
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
                    message: 'Error getting product',
                    detail: error
                }
            })
        }
    }

    async updateProduct(productId, formData) {
        try {
            const response = await fetch(`${env.apiUrl}/products/${productId}`, {
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
                    message: 'Error updating product',
                    detail: error
                }
            })
        }
    }

    async deleteProduct(productId) {
        try {
            const response = await fetch(`${env.apiUrl}/products/${productId}`, {
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
                    message: 'Error deleting product',
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
        return response
    }
}

export default new ProductsAPI()