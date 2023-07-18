import { Fragment, useEffect, useState } from "react";
import { useAuth } from "../Contexts/Auth";
import { useUtils } from "../Contexts/Utils";
import { ILineInfo, IRingDings } from "../Types/Lines";
import { BACKEND_PATH } from "../services/paths";
import ConfirmBuy from "../Modals/ConfirmBuy";
import Header from "../Components/Header";
import api from "../services/api";
import EndSession from "../Modals/EndSession";
import { RingBox } from "../Components/RingBox";
import { Alert } from "../Components/Alert";
import { Footer } from "../Components/Footer";
import ChargeAccount from "../Modals/ChargeAccount";

import { BsCartPlus } from "react-icons/bs";
import { AiOutlineCheck } from "react-icons/ai";
import { BiBlock } from "react-icons/bi";

interface IMyRings {
    RingTones: IRingDings;
    buyedId: string;
}

interface IPlayerMetadata {
    id: string;
    player: HTMLAudioElement
}

export default function RingDings(){

    const { verifyPreLogin, userData } = useAuth();
    const { setIsLoading, showAlert } = useUtils();

    const [ringDings, setRingDings] = useState<IRingDings[]>([]);
    const [player, setPlayer] = useState<IPlayerMetadata>({ player: new Audio(), id: '' });
    const [myRingDings, setMyRingDings] = useState<IMyRings[]>([]);
    const [linesList, setLinesList] = useState<ILineInfo[]>([]);
    const [selectedLine, setSelectedLine] = useState('');
    const [activeRing, setActiveRing] = useState('');
    const [selectedRing, setSelectedRing] = useState<IRingDings>({} as IRingDings);
    const [modal, setModal] = useState('');

    useEffect(() => {
        async function loadMyRingsDings(){
            setIsLoading(true);
            const preLoginStatus = await verifyPreLogin();
            if(!preLoginStatus){
                location.href = "/";
            }
            try {
                const phoneLines = await api.get('/phoneLines');
                setLinesList(phoneLines.data.PhoneLines);
                setSelectedLine(phoneLines.data.PhoneLines[0].msisdn);
                changePhoneSelected(phoneLines.data.PhoneLines[0].msisdn, true);
            }catch(e: any){
                setIsLoading(false);
                if(e.code === "ERR_NETWORK"){
                    showAlert("error", "Ocorreu um erro na ligação ao servidor!");
                }else{
                    showAlert("error", e.response.data.message);
                }
            }
            try {
                const myRings = await api.get('/myRingDings');
                setMyRingDings(myRings.data);
            }catch(e: any){
                setIsLoading(false);
                if(e.code === "ERR_NETWORK"){
                    showAlert("error", "Ocorreu um erro na ligação ao servidor!");
                }else{
                    showAlert("error", e.response.data.message);
                }
            };

        }
        loadMyRingsDings();
    }, []);

    async function loadRingsDings(){
        try {
            const libRingDings: IRingDings[] = (await api.get('/listRingDings')).data;
            const unusedRingDings = libRingDings.filter(ringDingList => !myRingDings.some(myRings => ringDingList.ringId === myRings.RingTones.ringId));
            setRingDings(unusedRingDings);
            setIsLoading(false);
        }catch(e: any){
            setIsLoading(false);
            if(e.code === "ERR_NETWORK"){
                showAlert("error", "Ocorreu um erro na ligação ao servidor!");
            }else{
                showAlert("error", e.response.data.message);
            }
        }
    }
    
    useEffect(() => {
        if(myRingDings.length > 0){
            loadRingsDings();
        }
    }, [myRingDings]);

    async function changePhoneSelected(msisdn: string, isLoad: boolean = false){
        setIsLoading(true);
        try {
            const actualRing = (await api.get('/getLineActualRing/' + msisdn)).data;
            setActiveRing(actualRing.RingTonesBuyed.buyedId);
            if(!isLoad){
                setIsLoading(false);
            }
        }catch(e: any){
            setIsLoading(false);
            if(e.code === "ERR_NETWORK"){
                showAlert("error", "Ocorreu um erro na ligação ao servidor!");
            }else{
                showAlert("error", e.response.data.message);
            }
        }
    }

    async function playMusic(ringDing: IRingDings) {
        try {
            const signPlayback = (await api.get('/signPlayback/' + ringDing.ringId)).data;
            setPlayer((lastAudio) => {
                const lastAudioItem = { ...lastAudio };
                if(lastAudioItem.player.paused){
                    lastAudioItem.player.src = BACKEND_PATH + "/static/private/playback?playbackAuth=" + signPlayback.authToken;
                    lastAudioItem.id = ringDing.ringId;
                    lastAudioItem.player.play();
                }else if(lastAudioItem.id === ringDing.ringId){
                    lastAudioItem.player.pause();
                    lastAudioItem.id = "";
                }else{
                    lastAudioItem.player.src = BACKEND_PATH + "/static/private/playback?playbackAuth=" + signPlayback.authToken;
                    lastAudioItem.id = ringDing.ringId;
                    lastAudioItem.player.play();
                }
                lastAudioItem.player.onended = function() {
                    lastAudioItem.id = "";
                };
                return lastAudioItem;
            });
        }catch(e: any){
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if(e.code === "ERR_NETWORK"){
                showAlert("error", "Ocorreu um erro na ligação ao servidor!");
            }else{
                showAlert("error", e.response.data.message);
            }
        }
    }

    async function updateRingDing(ringBuyedId: string){
        setIsLoading(true);
        try {
            const ringRes = await api.post('/updateRingTone/' + selectedLine, {
                buyedId: ringBuyedId
            });
            setIsLoading(false);
            setActiveRing(ringBuyedId);
            showAlert("sucess", ringRes.data.message);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }catch(e: any) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsLoading(false);
            if(e.code === "ERR_NETWORK"){
                showAlert("error", "Ocorreu um erro na ligação ao servidor!");
            }else{
                showAlert("error", e.response.data.message);
            }
        }
    }

    function buyRingDing(ringId: string){
        const ringBeBuyed = ringDings.find((beBuyed) => { return(beBuyed.ringId === ringId); });
        if(!ringBeBuyed){
            showAlert("error", "Ocorreu um erro na compra! (ID de RingDing não encontrado)");
        }else{
            setModal("confirmBuy");
            setSelectedRing(ringBeBuyed);
        }
    }

    async function enableService(){
        setIsLoading(true);
        try {
            const res = (await api.get('/activateLine/' + selectedLine)).data;
            showAlert("sucess", res.message);
            setIsLoading(false);
            setLinesList((phoneLines) => {
                const lastPhoneLines = phoneLines;
                lastPhoneLines[lastPhoneLines.findIndex((phoneLineItem) => { return (phoneLineItem.msisdn === selectedLine); })].activated = true;
                return lastPhoneLines;
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }catch(e: any){
            setIsLoading(false);
            if(e.code === "ERR_NETWORK"){
                showAlert("error", "Ocorreu um erro na ligação ao servidor!");
            }else{
                showAlert("error", e.response.data.message);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function closeModal() {
        setModal('');
    }

    function updateRingDingsList(ringBeBuyed: IRingDings, buyedId: string) {
        setMyRingDings((myRings) => {
            const lastMyRings = myRings;
            lastMyRings.push({
                buyedId: buyedId,
                RingTones: {
                    ringName: ringBeBuyed.ringName,
                    ringAuthor: ringBeBuyed.ringAuthor,
                    ringId: ringBeBuyed.ringId,
                    coverPath: ringBeBuyed.coverPath,
                    price: ringBeBuyed.price
                }
            });
            return lastMyRings;
        });
        loadRingsDings();
    }

    return (
        <div className="flex flex-col">
            { Object.keys(userData).length > 0 && linesList.length > 0 ?
            <Fragment>
                <Header setModal={setModal} />
                <div className="flex justify-center">
                    <div className="flex flex-col items-center mt-5">
                        <h1 className="text-4xl text-zinc-800 font-light">RingDings</h1>
                        <p className="mt-2 text-zinc-800 text-lg">Escolha a sua musica favorita para os outros ouvirem quando lhe ligam :)</p>
                        <Alert />
                        <div className="w-full flex flex-col mt-2">
                            <div className="flex flex-col">
                                <p className="text-zinc-800 text-xl">Os meus RingDings</p>
                                <div className="flex mt-2 items-center">
                                    <p className="text-zinc-800">RingDings de: </p>
                                    <select className="text-zinc-800 py-0.5 ml-1 px-1 pr-2 border border-gray-200 rounded-md text-base focus:border-zinc-800 outline-none" value={selectedLine} onChange={(e) => { setSelectedLine(e.target.value); changePhoneSelected(e.target.value); }}>
                                    { linesList.map((line) => {
                                        return (
                                            <option key={line.msisdn} value={line.msisdn}>{line.msisdn.slice(4)}</option>
                                        );
                                    }) }
                                    </select>
                                </div>
                                { linesList[linesList.findIndex((line) => { return (line.msisdn === selectedLine); })].activated ?
                                <div className="grid grid-cols-4 gap-x-2">
                                { myRingDings.length > 0 ?
                                    <Fragment>
                                        { myRingDings.map((myRingDing) => {
                                            return (
                                                <RingBox.Root key={myRingDing.RingTones.ringId}>
                                                    <RingBox.Player
                                                        action={() => { playMusic(myRingDing.RingTones) }}
                                                        cover={myRingDing.RingTones.coverPath}
                                                        playing={player.id === myRingDing.RingTones.ringId}
                                                    />
                                                    <RingBox.Metadata
                                                        name={myRingDing.RingTones.ringName}
                                                        author={myRingDing.RingTones.ringAuthor}
                                                    />
                                                    <RingBox.Action
                                                        actionName={activeRing === myRingDing.buyedId ? "Ativo" : "Ativar"}
                                                        ringAction={() => { activeRing !== myRingDing.buyedId ? updateRingDing(myRingDing.buyedId): null }}
                                                        colorActive={activeRing === myRingDing.buyedId}
                                                        icon={AiOutlineCheck}
                                                    />
                                                </RingBox.Root>
                                            )
                                        })}
                                    </Fragment> : null }
                                </div>
                                :
                                <div className="border-4 rounded border-dashed p-1 mt-4 flex flex-col items-center">
                                    <BiBlock className="w-48 h-48 text-red-500" />
                                    <p className="text-zinc-800 text-lg font-medium">O serviço selecionado não se encontra ativo!</p>
                                    <div className="flex p-2 w-fit items-center bg-zinc-800 rounded hover:bg-zinc-900 mt-2 hover:cursor-pointer mb-3" onClick={() => { enableService(); }}>
                                        <AiOutlineCheck className="w-6 h-6 text-white" />
                                        <p className="text-white ml-2">Ativar Serviço</p>
                                    </div>
                                </div>
                                }
                            </div>
                            <div className="flex flex-col mt-6">
                                <p className="text-zinc-800 text-xl">Biblioteca de RingDings</p>
                                <div className="grid grid-cols-4 gap-x-2">
                                { ringDings.length > 0 ?
                                    <Fragment>
                                        { ringDings.map((ringDing) => {
                                            return (
                                                <RingBox.Root key={ringDing.ringId}>
                                                    <RingBox.Player
                                                        action={() => { playMusic(ringDing) }}
                                                        cover={ringDing.coverPath}
                                                        playing={player.id === ringDing.ringId}
                                                    />
                                                    <RingBox.Metadata
                                                        name={ringDing.ringName}
                                                        author={ringDing.ringAuthor}
                                                        price={ringDing.price}
                                                    />
                                                    <RingBox.Action
                                                        actionName="Comprar"
                                                        ringAction={() => { buyRingDing(ringDing.ringId) }}
                                                        colorActive={false}
                                                        icon={BsCartPlus}
                                                    />
                                                </RingBox.Root>
                                            )
                                        })}
                                    </Fragment> : <p className="mt-1 text-zinc-800 text-lg">Atualmente não existem RingDings disponiveis para este serviço!</p> }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <Footer />
            </Fragment>
            : null }
            { modal === "confirmBuy" ?
                <ConfirmBuy
                    closeAction={closeModal}
                    ringDings={ringDings}
                    ringDing={selectedRing}
                    updateRingDingsList={updateRingDingsList}
                /> : modal === "endSession" ?
                <EndSession
                    closeAction={closeModal}
                />
                : modal === "chargeAccount" ?
                <ChargeAccount
                    closeAction={closeModal}
                />
            : null }
        </div>
    );
}