import {
    env
} from '../env'

class UserAPI {

    async getUser(userId) {
        try {
            const response = await fetch(`${env.apiUrl}/users/${userId}`, {
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
            console.log(error)
            return this.complete(null, {
                error: {
                    type: 'client',
                    message: 'Error getting userId',
                    detail: error
                }
            })
        }
    }

    async updateUser(userId, formData) {
        try {
            const response = await fetch(`${env.apiUrl}/users/${userId}`, {
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
            console.log(error)
            return this.complete(null, {
                error: {
                    type: 'client',
                    message: 'Error updating user',
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

export default new UserAPI()