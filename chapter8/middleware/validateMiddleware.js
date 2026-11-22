const validateMiddleware = (req, res, next) => {
    const { title, body } = req.body ?? {}

    if (
        typeof title !== 'string' || !title.trim() ||
        typeof body !== 'string' || !body.trim()
    ) {
        return res.redirect('/posts/new')
    }

    next()
}

module.exports = validateMiddleware
