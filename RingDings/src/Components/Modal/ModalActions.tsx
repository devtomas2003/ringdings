interface IModalActions {
    children: React.ReactNode;
}

export function ModalActions(props: IModalActions){
    return (
        <div className="flex space-x-2 mt-2">
            { props.children }
        </div>
    );
}