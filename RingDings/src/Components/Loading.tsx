import { useUtils } from "../Contexts/Utils";

import { BiLoaderCircle } from "react-icons/bi";
import { Fragment } from "react";

export default function Loading(){

    const { isLoading } = useUtils();

    return (
        <Fragment>
            { isLoading ?
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-20 flex items-center justify-center z-20">
                <div className="bg-white p-4 rounded-md flex flex-col items-center shadow">
                    <BiLoaderCircle className="w-16 h-16 animate-[spin_2s_linear_infinite]" color="#4B5563" />
                    <p className="mt-2 text-gray-600 text-xl">A Processar...</p>
                </div>
            </div> : null }
        </Fragment>
    );
}