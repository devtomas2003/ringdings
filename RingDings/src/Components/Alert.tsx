import { AiOutlineClose } from "react-icons/ai";

import { Fragment } from "react";
import { useUtils } from "../Contexts/Utils";

export function Alert(){

    const { alert, showAlert } = useUtils();

    return (
        <Fragment>
            { alert.alertBody !== "" ?
            <Fragment>
                { alert.alertStatus === "error" ?
                <div className="mt-2 w-full">
                    <div className="bg-red-500 rounded-t px-4 py-2">
                        <p className="text-white font-bold">Ops, algo de errado ocorreu!</p>
                    </div>
                    <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 flex justify-between">
                        <p className="text-red-700">{alert.alertBody}</p>
                        <div className="hover:cursor-pointer" onClick={() => { showAlert("unknown", ""); }}>
                            <AiOutlineClose className="w-6 h-6 text-red-700" />
                        </div>
                    </div>
                </div>
                :
                <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md w-full mt-2 flex justify-between items-center">
                    <div className="flex">
                        <div className="py-1"><svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                        <div>
                            <p className="font-bold">Sucesso</p>
                            <p className="text-sm">{alert.alertBody}</p>
                        </div>
                    </div>
                    <div className="hover:cursor-pointer" onClick={() => { showAlert("unknown", ""); }}>
                        <AiOutlineClose className="w-6 h-6 text-teal-900" />
                    </div>
                </div> }
            </Fragment> : null }
        </Fragment>
    );
}