'use client';

import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useState} from "react";
import Logo from '../../../public/nutrelli-logo.png';
import {AlertCircle, Eye, EyeOff, Loader2, Lock, Mail} from "lucide-react";
import {login} from "@/services/loginService";
import {Card, CardContent} from "@/components/ui/card";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

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
            const user = await login(formData.email, formData.password);
            router.push('/dashboard');
        } catch (error) {
            setError(error.message || 'Ocorreu um erro ao fazer login. Tente novamente.');
        } finally {
            setLoading(false)
        }
    }

    const isSubmitDisabled = loading || !formData.email || !formData.password;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-100 to-gray-50">
            <div className="w-full max-w-md">
                <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/90">
                    <CardContent className="p-6 md:p-8">
                        <div className="text-center mb-8">
                            <div
                                className="inline-flex items-center justify-center rounded-full bg-white shadow-lg mb-6">
                                <Image
                                    src={Logo} alt="Nutrelli Logo"
                                    width={125}
                                    height={125}
                                    priority
                                    className="h-auto w-auto"/>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Bem-vindo!</h1>
                            <p className="text-gray-600">Entre com suas credenciais para acessar sua conta</p>
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
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 font-medium">E-mail</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Mail className="h-4 w-4 text-gray-400"/>
                                    </div>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="seu@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`pl-10 py-2 transition-colors ${touched.email && getFieldError('email') ?
                                            'border-red-500 focus:border-red-500' : ''}`}
                                        aria-invalid={!!getFieldError('email')}/>
                                </div>
                                <div>
                                    {touched.email && getFieldError('email') && (
                                        <p className="mt-1 text-sm text-red-500">{getFieldError('email')}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor='password' className="text-gray-700 font-medium">Senha</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Lock className="w-4 h-4 text-gray-400"/>
                                    </div>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        placeholder="Digite sua senha"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`pl-10 pr-10 py-2 transition-colors 
                                        ${touched.password && getFieldError('password') ? 'border-red-500 focus:border-red-500' : ''}`}
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
                                className={`w-full py-2 transition-all duration-200 ${
                                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 active:transform active:scale-95'}`}
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
        </div>);
}
