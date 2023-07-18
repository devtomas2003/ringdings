import { Fragment } from "react";

interface IRingMetadata {
    name: string;
    author: string;
    price?: string;
}

export function RingMetadata(props: IRingMetadata){
    return (
        <Fragment>
            <p className="text-zinc-800 text-lg font-medium">{props.name}</p>
            <p className="text-zinc-800 font-light text-base">{props.author}</p>
            { props.price ? <p className="text-zinc-800 mt-2 text-lg font-bold">{parseFloat(props.price) !== 0 ? "€ " + parseFloat(props.price).toFixed(2).replace(".", ",") : 'Gratis'}</p> : null }
        </Fragment>
    );
}