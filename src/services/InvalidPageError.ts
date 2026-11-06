export class InvalidPageError extends Error {
    constructor(message: string) {
        super( message);
        this.name = "InvalidPageError";
    }
}