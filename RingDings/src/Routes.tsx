import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Loading from "./Components/Loading";
import { UtilsProvider } from "./Contexts/Utils";

import Login from "./Views/Login";
import { AuthProvider } from "./Contexts/Auth";
import RingDings from "./Views/RingDings";

export default function Router(){
    return (
        <BrowserRouter>
            <UtilsProvider>
                <AuthProvider>
                    <Loading />
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/my" element={<RingDings />} />
                    </Routes>
                </AuthProvider>
            </UtilsProvider>
        </BrowserRouter>
    );
}