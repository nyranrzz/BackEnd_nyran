const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Doğrulama xətası',
            details: err.details
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Giriş icazəsi yoxdur'
        });
    }

    res.status(500).json({
        error: 'Daxili server xətası',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Bir xəta baş verdi'
    });
};

module.exports = errorHandler; 