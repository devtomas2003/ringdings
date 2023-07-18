import { useAuth } from "../Contexts/Auth";
import { useUtils } from "../Contexts/Utils";
import api from "../services/api";

export function Footer(){

    const { userData } = useAuth();
    const { setIsLoading, showAlert } = useUtils();

    async function saveTransactions(){
        setIsLoading(true);
        try{
            const response  = (await api.get('/getTransactions', {
                responseType: 'blob'
            })).data;
            const fileBlob = new Blob([response], { type: "text/csv" });
            window.open(URL.createObjectURL(fileBlob));
            setIsLoading(false);
        }catch(e: any){
            setIsLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if(e.code === "ERR_NETWORK"){
                showAlert("error", "Ocorreu um erro na ligação ao servidor!");
            }else{
                showAlert("error", "Não existem transações na sua conta atualmente!");
            }
        }
    }

    return (
        <div className="mt-10 p-3 border-t w-full flex items-center justify-between">
            <div className="flex items-center">
                <img src="/smallLogo.svg" className="w-32" title="SpaceLabs" alt="SpaceLabs"/>
                <h2 className="text-zinc-800 text-2xl ml-1">RingDings</h2>
            </div>
            <div className="flex mr-2 text-zinc-800 flex-col items-end">
                <p>Utilizador: <label className="font-bold">{userData.name}</label></p>
                <a onClick={() => { saveTransactions(); }} target="_blank" className="underline hover:cursor-pointer">Movimentos</a>
                <p className="mt-0.5">{new Date().getFullYear()} © SpaceLabs. Todos os direitos reservados!</p>
            </div>
        </div>
    );
}