type SuccessResponse = {
	success: true
	data: any
}

type ErrorResponse = {
	success: false
	message: string
}

const generateResponse = (data: SuccessResponse | ErrorResponse) => {
	return new Response(JSON.stringify(data))
}
