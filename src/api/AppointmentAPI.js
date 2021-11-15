import {
    env
} from '../env'

class AppointmentAPI {

    async addAppointment(formData) {
        try {
            const response = await fetch(`${env.apiUrl}/appointments`, {
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
                    message: 'Error adding appointment',
                    detail: error
                }
            })
        }
    }

    async getAppointments(userId=null) {
        try {
            const response = await fetch(`${env.apiUrl}/appointments${userId ? `/user/${userId}` : ''}`, {
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
                    message: 'Error getting appointments',
                    detail: error
                }
            })
        }
    }

    async getReviews(type=null) {
        try {
            const response = await fetch(`${env.apiUrl}/appointments/reviews${type ? `/${type}` : ''}`, {
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

    async updateStatus(appointmentId, formData) {
        try {
            const response = await fetch(`${env.apiUrl}/appointments/${appointmentId}/status`, {
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
                    message: 'Error updating appointment',
                    detail: error
                }
            })
        }
    }

    async updateReview(appointmentId, formData) {
        try {
            const response = await fetch(`${env.apiUrl}/appointments/${appointmentId}/review`, {
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
                    message: 'Error updating appointment',
                    detail: error
                }
            })
        }
    }

    async deleteReview(appointmentId) {
        try {
            const response = await fetch(`${env.apiUrl}/appointments/${appointmentId}/review`, {
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
                    message: 'Error updating appointment',
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

export default new AppointmentAPI()