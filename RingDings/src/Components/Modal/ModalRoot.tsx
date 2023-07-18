interface IModalRoot {
    children: React.ReactNode;
}

export default function ModalRoot(props: IModalRoot){
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="w-1/2 bg-white p-5 rounded shadow">
                { props.children }
            </div>
        </div>
    );
}