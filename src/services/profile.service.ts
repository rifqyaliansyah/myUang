import api from './api'

const profileService = {
    getProfile: () => api.get('/profile'),

    updateProfile: (data: {
        name: string
        quotes?: string
        avatar?: File | null  
    }) => {
        const form = new FormData()
        form.append('name', data.name)
        if (data.quotes !== undefined) form.append('quotes', data.quotes)
        if (data.avatar) form.append('avatar', data.avatar)  
        return api.put('/profile', form)
    },
}

export default profileService