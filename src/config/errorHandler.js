/**
 * Express error-handling middleware.
 *
 * @param {Error} err - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 */
const errorHandler = (err, req, res, next) => {
	console.log(err);

	// Adjust the statusCode for TypeError errors
	if (err instanceof TypeError) {
		err.statusCode = 400;
	}

	// Determine the error code; default to 404 if not 400 or 500
	const code = [400, 500].includes(err.statusCode) ? err.statusCode : 404;

	// Define error messages for each code
	const messages = {
		500: "Se produjo un error interno del servidor",
		400: err.message || "Hubo un error con los parámetros de la solicitud.",
		404: "No se encontró el recurso solicitado",
	};

	const response = {
		error: {
			message: messages[code],
			status: 'error',
			code,
		},
	};

	res.status(code).send(response);
};

export default errorHandler;