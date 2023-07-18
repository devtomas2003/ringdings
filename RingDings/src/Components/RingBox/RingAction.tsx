import { ButtonHTMLAttributes, ElementType, Fragment } from "react";

interface IRingAction extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ElementType;
    actionName: string;
    ringAction(): void;
    colorActive: boolean;
};

export function RingAction({ icon: Icon, ringAction, colorActive, actionName, ...rest }: IRingAction){
    return (
        <Fragment>
            { colorActive ?
            <button className="flex bg-emerald-500 py-1 px-3 rounded items-center justify-center mt-1" {...rest} onClick={ringAction}>
                { Icon ? <Icon className="w-6 h-6 text-white mr-2" /> : null }
                <p className="text-white">{actionName}</p>
            </button>
            :
            <button className="flex bg-zinc-800 py-1 px-3 rounded items-center justify-center hover:bg-zinc-900 hover:cursor-pointer mt-1" {...rest} onClick={ringAction}>
                { Icon ? <Icon className="w-6 h-6 text-white mr-2" /> : null }
                <p className="text-white">{actionName}</p>
            </button> }
        </Fragment>

    );
}