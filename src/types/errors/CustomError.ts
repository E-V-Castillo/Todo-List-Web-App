export class CustomError extends Error {
    statusCode: number
    debugError: string | Error
    constructor(statusCode: number, message: string, debugError: Error) {
        super(message)
        this.statusCode = statusCode
        this.debugError = debugError
    }
}
