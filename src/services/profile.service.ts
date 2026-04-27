import api from './api'

export interface UpdateProfilePayload {
    name: string
    quotes?: string
}

const profileService = {
    getProfile: () =>
        api.get('/profile'),

    updateProfile: (data: UpdateProfilePayload) =>
        api.put('/profile', data),
}

export default profileService