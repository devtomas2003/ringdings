import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { BACKEND_PATH } from "../../services/paths";

interface IRingPlayer {
    action(): void;
    cover: string;
    playing: boolean;
}

export function RingPlayer(props: IRingPlayer){
    return (
        <div
            style={{ backgroundImage: `url(${BACKEND_PATH}/static/public/covers/${props.cover})` }}
            className="bg-cover w-52 h-52 flex items-center justify-center hover:cursor-pointer rounded"
            onClick={() => { props.action(); }}
        >
            <div className="border-white border-2 w-fit rounded-full flex items-center justify-center">
                { props.playing ? <BsFillPauseFill className="w-14 h-14 text-white" /> : <BsFillPlayFill className="w-14 h-14 text-white" /> }
            </div>
        </div>
    );
}