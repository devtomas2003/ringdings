import { ButtonHTMLAttributes, ElementType } from "react";

interface IModalAction extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ElementType;
    actionName: string;
};

export function ModalAction({ icon: Icon, actionName, ...rest }: IModalAction){
    return (
        <button {...rest} className="flex p-2 w-fit items-center bg-zinc-800 rounded hover:bg-zinc-900 hover:cursor-pointer" type="submit">
            { Icon ? <Icon className="w-6 h-6 text-white mr-2" /> : null }
            <p className="text-white">{actionName}</p>
        </button>
    );
}