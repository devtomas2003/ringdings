import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../services/api";
import { useUtils } from "../Contexts/Utils";
import { useEffect } from "react";

const submitLoginFormSchema = z.object({
    email: z.string().nonempty('O email é obrigatório!').email('O email é inválido!'),
    password: z.string().min(8, 'A Password têm de ter 8 caracteres!')
});

type SubmitLoginFormData = z.infer<typeof submitLoginFormSchema>;

export default function Login(){

    useEffect(() => {
        function checkPreLogin(){
            if(localStorage.getItem("@spacelabs/auth")){
                location.href = "/my";
            }
        }
        checkPreLogin();
    }, []);

    const { setIsLoading } = useUtils();

    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<SubmitLoginFormData>({
        resolver: zodResolver(submitLoginFormSchema),
        mode: 'onChange',
    });

    function submitLogin(data: SubmitLoginFormData){
        setIsLoading(true);
        reset();
        api.get('/startSession', {
            auth: {
                username: data.email,
                password: data.password
            }
        }).then((accountLogin) => {
            localStorage.setItem('@spacelabs/auth', accountLogin.data.authToken)
            location.href = "/my";
        }).catch((e) => {
            setIsLoading(false);
            if(e.code === "ERR_NETWORK"){
                setError('password', {
                    message: 'Ocorreu um erro na ligação ao servidor!'
                });
            }else{
                setError('password', {
                    message: e.response.data.message
                });
            }
        })
    }

    return (
        <div className="absolute w-full h-full flex flex-col items-center justify-center">
            <img src="/logo.svg" title="SpaceLabs" alt="SpaceLabs" className="w-64" />
            <h1 className="text-zinc-800 text-xl mt-3">Iniciar sessão com ID</h1>
            <form className="flex flex-col space-y-2 mt-5 w-96" onSubmit={handleSubmit(submitLogin)}>
                <div className="flex flex-col">
                    <p className="text-zinc-800 font-bold">E-Mail</p>
                    <div className="border rounded-sm p-1 border-zinc-800">
                        <input
                            type="text"
                            className="outline-none w-full"
                            autoComplete="email"
                            autoCorrect="off"
                            autoCapitalize="off"
                            {...register('email')}
                        />
                    </div>
                    { errors.email ? <p className="text-red-600">{errors.email.message}</p> : null }
                </div>
                <div className="flex flex-col">
                    <p className="text-zinc-800 font-bold">Password</p>
                    <div className="border rounded-sm p-1 border-zinc-800">
                        <input
                            type="password"
                            className="outline-none w-full"
                            autoComplete="password"
                            autoCorrect="off"
                            autoCapitalize="off"
                            {...register('password')}
                        />
                    </div>
                    { errors.password ? <p className="text-red-600">{errors.password.message}</p> : null }
                </div>
                <button type="submit" className="hover:bg-zinc-900 bg-zinc-800 p-2 hover:cursor-pointer rounded">
                    <p className="text-base text-white font-bold">Entrar</p>
                </button>
            </form>
            <p className="mt-2 text-zinc-800">{new Date().getFullYear()} © SpaceLabs. Todos os direitos reservados.</p>
        </div>
    );
}