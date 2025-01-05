'use client';

import Image from 'next/image'
import {useRouter} from 'next/navigation';
import {useState} from "react";
import Logo from '../../../public/nutrelli-logo.png'
import { Eye, EyeOff} from "lucide-react";
import {login} from "@/services/loginService";


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [wasValidated, setWasValidated] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setWasValidated(true);


        const form = e.currentTarget;
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        try {
            setLoading(true);
            const user = await login(email, password);
            console.log('Usuário logado ', user);
            router.push('/dashboard');
        } catch (error) {
            setError(error.message);
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card border-0 shadow-lg">
                            <div className="text-center mb-4">
                                <div className="rounded-circle d-inline-block mt-3 shadow bg-white">
                                    <Image src={Logo} alt="Nutrelli Logo"
                                           className="img-fluid"
                                           id="logo"
                                           width={200}
                                           height={200}
                                           priority/>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <div className="text-center mb-4">
                                    <h1 className="h3 mb-2 fw-bold">Bem-vindo!</h1>
                                    <p className="text-muted">Faça login</p>
                                </div>
                                <div className="card-body px-4 py-4">
                                    {error && (
                                        <div className="alert alert-danger" role="alert">{error}</div>
                                    )}
                                </div>
                                <form onSubmit={handleSubmit}
                                      className={`needs-validation ${wasValidated ? 'was-validated' : ''}`}
                                      noValidate>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">E-mail</label>
                                        <div className="input-group has-validation">
                                            <input type="email" id="email" className="form-control"
                                                   value={email}
                                                   placeholder="Insira seu e-mail"
                                                   onChange={(e) => setEmail(e.target.value)}
                                                   required/>
                                            <div className="invalid-feedback">Por favor, insira um e-mail válido.</div>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label">Senha</label>
                                        <div className="input-group has-validation">
                                            <input type={showPassword ? 'text' : 'password'}
                                                   id="password"
                                                   className="form-control"
                                                   value={password}
                                                   placeholder="Insira sua senha"
                                                   onChange={(e) => setPassword(e.target.value)}
                                                   required/>
                                            <button type="button" className="btn btn-outline-secondary"
                                                    onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} /> }
                                            </button>
                                            <div className="invalid-feedback">A senha é obrigatória</div>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-danger w-100 mb-3"
                                            disabled={loading}>{loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"
                                                  aria-hidden="true"></span>
                                            Entrando...
                                        </>
                                    ) : 'Entrar'}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
