import { AiOutlineInfoCircle } from "react-icons/ai";
import { ImExit } from "react-icons/im";
import { useAuth } from "../Contexts/Auth";
import { Modal } from "../Components/Modal";

interface IEndSession {
    closeAction(): void;
}

export default function EndSession(props: IEndSession){

    const { makeLogout } = useAuth();

    return (
        <Modal.Root>
            <Modal.Header icon={AiOutlineInfoCircle} modalName="Terminar Sessão" closeAction={props.closeAction} />
            <p className="mt-2 text-zinc-800">Pretende realmente terminar sessão desta aplicação?</p>
            <Modal.Actions>
                <Modal.Action onClick={makeLogout} actionName="Sair" icon={ImExit} />
            </Modal.Actions>
        </Modal.Root>
    );
}