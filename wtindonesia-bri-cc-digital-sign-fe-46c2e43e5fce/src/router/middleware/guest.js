export default function guest({ next, store }) {
    if (store.getters.user.roles) {
        return next({
            name: 'dashboard'
        })
    }

    return next()
}