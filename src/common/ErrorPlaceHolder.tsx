import parseErrorString from "@/utils/parseErrorString";

export default function ErrorPlaceHolder({ error }: { error: any }) {
    const errorString = parseErrorString(error);
    return (
        <p className="text-red-600 font-bold text-lg mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            {errorString}
        </p>
    );
}