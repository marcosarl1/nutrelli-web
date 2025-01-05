'use client';

import './login.css';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useState} from "react";
import Logo from '../../../public/nutrelli-logo.png';
import {Eye, EyeOff, Lock, Mail} from "lucide-react";
import {login} from "@/services/loginService";
import {Alert, Button, Card, Col, Container, Form, FormControl, InputGroup, Row, Spinner} from "react-bootstrap";


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
        <Container fluid className="login-container min-vh-100 d-flex align-items-center justify-content-center p-3">
            <Row className="justify-content-center w-100">
                <Col xs={12} sm={10} md={8} lg={6} xl={4}>
                    <Card className="login-card  rounded-4 border-0 shadow-lg login-card">
                        <Card.Body className="p-4 p-md-5">
                            <div className="text-center mb-4">
                                <div
                                    className="logo-wrapper rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm bg-white">
                                    <Image src={Logo} alt="Nutrelli Logo"
                                           className="img-fluid"
                                           id="logo"
                                           width={150}
                                           height={150}
                                           priority/>
                                </div>
                            </div>
                            <div className="text-center mb-4">
                                <h1 className="h3 mb-2 fw-bold">Bem-vindo!</h1>
                                <p className="text-muted">Entre com suas credenciais</p>
                            </div>
                            {error && (
                                <Alert variant="danger">
                                    {error}
                                </Alert>
                            )}
                            <Form noValidate validated={wasValidated} onSubmit={handleSubmit} className="login-form">
                                <Form.Group className="mb-4" controlId="email">
                                    <Form.Label className="text-muted fw-medium">E-mail</Form.Label>
                                    <InputGroup hasValidation>
                                        <InputGroup.Text className="bg-light">
                                            <Mail size={18} className="text-muted"/>
                                        </InputGroup.Text>
                                        <FormControl
                                            type="email"
                                            placeholder="Insira seu e-mail"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="py-2"/>
                                        <FormControl.Feedback type="invalid">Por favor, insira um e-mail
                                            válido.</FormControl.Feedback>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="password">
                                    <Form.Label className="text-muted fw-medium">Senha</Form.Label>
                                    <InputGroup hasValidation>
                                        <InputGroup.Text className="bg-light">
                                            <Lock size={18} className="text-muted"/>
                                        </InputGroup.Text>
                                        <FormControl
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Insira sua senha"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="py-2"/>
                                        <Button
                                            variant="light"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="border">
                                            {showPassword ? <EyeOff size={18} className="text-muted"/> :
                                                <Eye size={18} className="text-muted"/>}
                                        </Button>
                                        <FormControl.Feedback type="invalid">A senha é
                                            obrigatória</FormControl.Feedback>
                                    </InputGroup>
                                </Form.Group>
                                <Button type="submit" variant="danger"
                                        className="w-100 py-2 mt-4 position-relative overflow-hidden"
                                        disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Entrando...
                                        </>
                                    ) : 'Entrar'}</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
