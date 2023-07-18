import { AiOutlineClose } from "react-icons/ai";
import { ElementType } from "react";

interface IModalHeader {
    icon?: ElementType;
    modalName: string;
    closeAction(): void;
}

export function ModalHeader({ icon: Icon, closeAction, modalName }: IModalHeader){
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                { Icon ? <Icon className="w-8 h-8 text-zinc-800 mr-2" /> : null }
                <p className="text-zinc-800 text-xl">{modalName}</p>
            </div>
            <div className="hover:cursor-pointer" onClick={() => { closeAction(); }}>
                <AiOutlineClose className="w-6 h-6 text-zinc-800" />
            </div>
        </div>
    );
}