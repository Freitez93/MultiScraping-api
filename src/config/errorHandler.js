

// Respuesta de error controlada
const errorHandler = (err, req, res, next) => {
    const statusCode = err instanceof SyntaxError ? 400 : 500;
    const messageErr = statusCode == 400
        ? "Solicitud mal formada"
        : "Error interno del servidor";

    console.error(err.stack);
    res.status(statusCode).json({
        message: err.message || messageErr,
        status: "error",
        code: statusCode
    });
};

export default errorHandler;