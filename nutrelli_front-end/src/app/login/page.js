'use client';

import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useState} from "react";
import Logo from '../../../public/nutrelli.svg';
import {AlertCircle, Eye, EyeOff, Loader2, Lock, Mail} from "lucide-react";
import {login} from "@/services/loginService";
import {Card, CardContent} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";

export default function Login() {
    const [formData, setFormData] = useState({
        email: '', password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({
        email: false, password: false
    });
    const router = useRouter();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setError('');
    }

    const getFieldError = (field) => {
        if (!touched[field]) return '';
        if (field === 'email') {
            if (!formData.email) return 'Email é obrigatório';
            if (!validateEmail(formData.email)) return 'Insira um e-mail válido';
        }
        if (field === 'password') {
            if (!formData.password) return 'Senha é obrigatória';
        }
        return '';
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({email: true, password: true});

        const emailError = getFieldError('email');
        const passwordError = getFieldError('password');

        if (emailError || passwordError) return;

        try {
            setLoading(true);
            await login(formData.email, formData.password);
            router.push('/dashboard');
        } catch (error) {
            setError(error.message || 'Ocorreu um erro ao fazer login. Tente novamente.');
        } finally {
            setLoading(false)
        }
    }

    const isSubmitDisabled = loading || !formData.email || !formData.password;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[url('/login-bg.png')] bg-cover bg-center">
            <div className="w-full max-w-md ">
                <div className="relative">
                    <div className="absolute left-1/2 -top-14 -translate-x-1/2 -translate-y-1/2 ">
                        <div
                            className="h-28 w-56 bg-[#FFFCF5] rounded-tl-full rounded-tr-full flex items-center justify-center shadow-inner">
                            <Image
                                src={Logo} alt="Nutrelli Logo"
                                priority/>
                        </div>
                    </div>
                    <Card className="border-0 shadow-2xl bg-[#FFFCF5] py-6">
                        <CardContent className="p-8">
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-bold text-red-700">Bem-vindo!</h1>
                            </div>
                            {error && (
                                <Alert variant="destructive" className="mb-6 flex items-center">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4"/>
                                        <AlertDescription className="">{error}</AlertDescription>
                                    </div>
                                </Alert>
                            )}
                            <form noValidate onSubmit={handleSubmit} className="space-y-6">
                                <div className="pb-4">
                                    <div className="relative">
                                        <Label htmlFor="email" className="absolute -top-3 left-3 bg-[#FFFCF5] px-1 text-sm text-gray-500">E-mail</Label>
                                        <Input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="seu@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={cn("pt-3 pb-2 px-4 border border-gray-300 rounded-md w-full",
                                                touched.email && getFieldError('email') ? "border-red-500 focus:border-red-500" : "")}
                                            aria-invalid={!!getFieldError('email')}/>
                                    </div>
                                    <div>
                                        {touched.email && getFieldError('email') && (
                                            <p className="mt-1 text-sm text-red-500">{getFieldError('email')}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="pb-4">
                                    <div className="relative">
                                        <Label htmlFor='password' className="absolute -top-3 left-3 bg-[#FFFCF5] px-1 text-sm text-gray-500">Senha</Label>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            placeholder="Digite sua senha"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={cn("pt-3 pb-2 px-4 border border-gray-300 rounded-md w-full",
                                                touched.password && getFieldError('password') ? 'border-red-500 focus:border-red-500' : '')}
                                            aria-invalid={!!getFieldError('password')}/>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 transition-colors"
                                            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                                            {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                        </button>
                                    </div>
                                    <div>
                                        {touched.password && getFieldError('password') && (
                                            <p className="mt-1 text-sm text-red-500">{getFieldError('password')}</p>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className={`w-full  py-2 transition-all duration-200 ${
                                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-900 hover:bg-red-950 active:transform active:scale-95'}`}
                                    disabled={isSubmitDisabled}>
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="animate-spin"/>
                                            <span>Entrando...</span>
                                        </div>) : ('Entrar')}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

    );
}
