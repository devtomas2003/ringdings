interface IRingRoot {
    children: React.ReactNode;
}

export function RingRoot(props: IRingRoot){
    return (
        <div className="border border-zinc-300 shadow p-3 mt-4">
            { props.children }
        </div>
    );
}