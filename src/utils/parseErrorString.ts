export default function parseErrorString(error: any) {
    if (typeof error === "string") {
        return error;
    }
    else if (typeof error?.message === "string") {
        return error.message;
    }
    else {
        return "An unknown error occurred";
    }
}