import { RiShutDownLine } from "react-icons/ri";
import { useAuth } from "../Contexts/Auth";

interface IHeader {
    setModal: React.Dispatch<React.SetStateAction<string>>;
}

export default function Header(props: IHeader){

    const { userData } = useAuth();

    return (
        <div className="w-full p-3 shadow flex justify-between items-center">
            <img src="/logo.svg" title="SpaceLabs" alt="SpaceLabs" className="w-48" />
            <div className="flex flex-col items-end">
                <div className="flex space-x-2 items-center">
                    <p className="text-zinc-800 text-lg">Olá, <label className="font-bold">{userData.name.split(" ")[0] + " " + userData.name.split(" ")[userData.name.split(" ").length-1]}</label></p>
                    <div className="hover:cursor-pointer" onClick={() => { props.setModal("endSession"); }}>
                        <RiShutDownLine className="w-6 h-6 text-zinc-800" />
                    </div>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                    <p>Saldo: </p>
                    { userData.balance >= 0 ?
                    <div className="bg-emerald-500 px-2 py-0.5 rounded hover:cursor-pointer" onClick={() => { props.setModal("chargeAccount"); }}>
                        <p className="text-white font-bold">{userData.balance.toFixed(2).replace(".", ",")} €</p>
                    </div>
                    :
                    <div className="bg-red-500 px-2 py-0.5 rounded hover:cursor-pointer" onClick={() => { props.setModal("chargeAccount"); }}>
                        <p className="text-white font-bold">{userData.balance.toFixed(2).replace(".", ",")} €</p>
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}