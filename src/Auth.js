import {
    env
} from './env'

/**
 * Class to handle authentication and current user
 */
class Auth {

    /**
     * Constructor
     */
    constructor() {
        this.currentUser = null
    }

    /**
     * Validate access token
     * 
     * @returns A response in the form of { error: any, data: any }
     */
    async check() {
        // check if local token is present
        if (!localStorage.dcAccessToken) {
            // no local token
            return this.complete({
                error: {
                    message: 'Please sign in',
                    type: 'no_token'
                }
            }, null)
        }

        try {
            const response = await fetch(`${env.apiUrl}/auth/validate`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.dcAccessToken}`
                }
            })

            if (!response.ok) {
                // console log error
                const err = await response.json() ?? {
                    error: {
                        message: 'Session expired, please sign in',
                        type: 'session_expired'
                    }
                }
                console.log(err)

                // delete local token
                localStorage.removeItem('dcAccessToken')
                return this.complete(null, err)
            }

            const data = await response.json()
            this.currentUser = data.user
            return this.complete(data, null)

        } catch (error) {
            console.log(error)
            return this.complete(null, {
                error: {
                    message: 'Error validating access token',
                    type: 'client',
                    detail: error
                }
            })
        }
    }

    /**
     * Sign up
     * 
     * @param {*} formData The data to use for signing up
     * 
     * @returns A response in the form of { data: any, error: any }
     */
    async signUp(formData) {
        try {
            const response = await fetch(`${env.apiUrl}/users`, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const err = await response.json() ?? {
                    error: {
                        type: 'api_no_err_message',
                        message: 'The data could not be processed.'
                    }
                }

                console.log(err)
                return this.complete(null, err)
            }

            const data = await response.json()
            return this.complete(data, null)
        } catch (error) {
            console.log(error)
            return this.complete(null, {
                error: {
                    type: 'client',
                    message: 'Error signing up',
                    detail: error
                }
            })
        }
    }

    /**
     * Sign in
     * 
     * @param {*} formData The data to use for signing in
     * 
     * @returns A response in the form of { data: any, error: any }
     */
    async signIn(formData) {
        try {
            const response = await fetch(`${env.apiUrl}/auth/signin`, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const err = await response.json() ?? {
                    error: {
                        type: 'api_no_err_message',
                        message: 'The data could not be authenticated.'
                    }
                }

                console.log(err)
                return this.complete(null, err)
            }

            // sign in success
            const data = await response.json()
            // save access token (jwt) to local storage
            localStorage.setItem('dcAccessToken', data.accessToken)
            // set current user
            this.currentUser = data.user
            return this.complete(data, null)
        } catch (error) {
            console.log(error)
            return this.complete(null, {
                error: {
                    type: 'client',
                    message: 'Error signing in',
                    detail: error
                }
            })
        }
    }

    /**
     * Sign out
     */
    signOut() {
        // delete local token
        localStorage.removeItem('dcAccessToken')
        // unset current user
        this.currentUser = null
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

// export an instance of Auth
export default new Auth()