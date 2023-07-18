import { AiOutlineInfoCircle } from "react-icons/ai";
import { BiMoneyWithdraw } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../services/api";
import { useUtils } from "../Contexts/Utils";
import { useAuth } from "../Contexts/Auth";
import { Modal } from "../Components/Modal";

interface IChargeAccount {
    closeAction(): void;
}

const submitChargeFormSchema = z.object({
    amount: z.string().refine((amount) => amount !== "", "Introduza um valor para carregamento!")
});

type SubmitChargeFormData = z.infer<typeof submitChargeFormSchema>;

export default function ChargeAccount(props: IChargeAccount){

    const { setIsLoading, showAlert } = useUtils();
    const { updateUserData } = useAuth();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<SubmitChargeFormData>({
        resolver: zodResolver(submitChargeFormSchema),
        mode: 'onChange',
    });

    async function submitCharge(data: SubmitChargeFormData){
        reset();
        setIsLoading(true);
        try {
            const chargeRes = (await api.post('/charge', {
                balance: data.amount
            })).data;
            showAlert("success", chargeRes.message);
            updateUserData((userInfo) => {
                const lastUserInfo = userInfo;
                lastUserInfo.balance = lastUserInfo.balance + parseFloat(data.amount);
                return lastUserInfo;
            });
            props.closeAction();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsLoading(false);
        }catch(e: any){
            window.scrollTo({ top: 0, behavior: 'smooth' });
            props.closeAction();
            setIsLoading(false);
            if(e.code === "ERR_NETWORK"){
                showAlert("error", "Ocorreu um erro na ligação ao servidor!");
            }else{
                showAlert("error", e.response.data.message);
            }
        }
    }

    return (
        <Modal.Root>
            <Modal.Header
                closeAction={props.closeAction}
                modalName="Efetuar Carregamento"
                icon={AiOutlineInfoCircle}
            />
            <form onSubmit={handleSubmit(submitCharge)}>
                <p className="mt-2 text-zinc-800">Introduza abaixo o valor com pretende carregar.</p>
                <div className="flex w-48 items-center border border-gray-200 pl-1 rounded-sm mt-2">
                    <input
                        type="number"
                        className="outline-none placeholder-zinc-800 w-full"
                        step="0.01"
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        placeholder="Ex: 1.24"
                        {...register('amount')}
                    />
                    <p className="text-zinc-800 text-lg mr-2 ml-2 font-bold">€</p>
                </div>
                { errors.amount ? <p className="text-red-500">{errors.amount.message}</p> : null }
                <Modal.Actions>
                    <Modal.Action actionName="Carregar" icon={BiMoneyWithdraw} />
                </Modal.Actions>
            </form>
        </Modal.Root>
    );
}