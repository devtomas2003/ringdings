import { AiOutlineCheck, AiOutlineInfoCircle } from "react-icons/ai";
import { Modal } from "../Components/Modal";
import { BACKEND_PATH } from "../services/paths";
import { IRingDings } from "../Types/Lines";
import { useUtils } from "../Contexts/Utils";
import api from "../services/api";
import { useAuth } from "../Contexts/Auth";

interface IConfirmBuy {
    closeAction(): void;
    updateRingDingsList(ringBeBuyed: IRingDings, buyedId: string): void;
    ringDing: IRingDings;
    ringDings: IRingDings[];
}

export default function ConfirmBuy(props: IConfirmBuy){

    const { setIsLoading, showAlert } = useUtils();
    const { updateUserData } = useAuth();

    async function confirmBuy(ringId: string){
        const ringBeBuyed = props.ringDings.find((beBuyed) => { return(beBuyed.ringId === ringId); });
        if(!ringBeBuyed){
            showAlert("error", "Ocorreu um erro na compra! (ID de RingDing não encontrado)");
        }else{
            setIsLoading(true);
            try{
                const resBuyRingDing = await api.post('/buyRingDing', {
                    ringId
                });
                showAlert("sucess", resBuyRingDing.data.message);
                props.updateRingDingsList(ringBeBuyed, resBuyRingDing.data.buyedId);
                updateUserData((userInfo) => {
                    const lastUserInfo = userInfo;
                    lastUserInfo.balance = lastUserInfo.balance - parseFloat(ringBeBuyed.price);
                    return lastUserInfo;
                });
                props.closeAction();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }catch(e: any){
                setIsLoading(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                props.closeAction();
                if(e.code === "ERR_NETWORK"){
                    showAlert("error", "Ocorreu um erro na ligação ao servidor!");
                }else{
                    showAlert("error", e.response.data.message);
                }
            }
        }
    }

    return (
        <Modal.Root>
            <Modal.Header
                closeAction={props.closeAction}
                icon={AiOutlineInfoCircle}
                modalName="Confirmar Compra"
            />
            <div>
                <p className="mt-2 text-zinc-800">Antes de confirmar a compra verifique os dados abaixo.</p>
                <div className="flex justify-between">
                    <div className="flex flex-col justify-between">
                        <ul className="mt-2">
                            <li className="text-zinc-800">Nome: <label className="font-bold">{props.ringDing.ringName}</label></li>
                            <li className="text-zinc-800">Autor: <label className="font-bold">{props.ringDing.ringAuthor}</label></li>
                            <li className="text-zinc-800">Preço: <label className="font-bold">€ {parseFloat(props.ringDing.price).toFixed(2).replace(".", ",")}</label></li>
                        </ul>
                        <Modal.Actions>
                            <Modal.Action
                                actionName="Confirmar Compra"
                                icon={AiOutlineCheck}
                                onClick={() => { confirmBuy(props.ringDing.ringId); }}
                            />
                        </Modal.Actions>
                    </div>
                    <div>
                        <img src={`${BACKEND_PATH}/static/public/covers/${props.ringDing.coverPath}`} title={props.ringDing.ringName + " - " + props.ringDing.ringAuthor} alt={props.ringDing.ringName + " - " + props.ringDing.ringAuthor} className="w-36 rounded" />
                    </div>
                </div>
            </div>
        </Modal.Root>
    );
}