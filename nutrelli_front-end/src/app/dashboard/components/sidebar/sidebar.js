'use client';

import {logout} from "@/services/loginService";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {PanelLeftOpen, PanelLeftClose, Box, ShoppingCart, Users, Layers, LogOut, Menu} from "lucide-react";
import {Button, Container, Nav, Navbar, Offcanvas} from "react-bootstrap";
import Logo from './/../../../../../public/nutrelli-logo.png';
import './sidebar.css'

export default function Sidebar({isOpen, setIsOpen}) {
    const [activeItem, setActiveItem] = useState('');
    const [showOffCanvas, setShowOffCanvas] = useState(false);
    const router = useRouter();

    const menuItems = useMemo(() => [{
        title: 'Produtos',
        icon: <Box size={20}/>,
        href: '/dashboard/produtos'
    }, {title: 'Pedidos', icon: <ShoppingCart size={20}/>, href: '/dashboard/pedidos'}, {
        title: 'Clientes',
        icon: <Users size={20}/>,
        href: '/dashboard/clientes'
    }, {title: 'Estoque', icon: <Layers size={20}/>, href: '/dashboard/estoque'},], []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsOpen(false);
                setShowOffCanvas(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [setIsOpen]);

    const handleToggle = () => {
        if (window.innerWidth < 768) {
            setShowOffCanvas(!showOffCanvas);
        } else {
            setIsOpen(!isOpen);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            await router.push('/login');
        } catch (error) {
            console.error('Erro ao fazer logout: ', error);
        }
    }

    const SidebarContent = ({isOffcanvas = false}) => (<>
        {!isOffcanvas && (
            <div
                className={`p-3 ${isOpen ? 'd-flex align-items-center justify-content-between' : 'd-flex flex-column align-items-center'}`}>
                <Link href="/dashboard" className="text-decoration-none mb-3">
                    <div className="logo-container bg-white rounded-circle">
                        <Image
                            src={Logo}
                            alt="Nutrelli Logo"
                            width={isOpen ? 120 : 60}
                            height={isOpen ? 120 : 60}
                            className="img-fluid"
                            style={{transition: 'width 0.3s ease'}}
                            priority/>
                    </div>
                </Link>
                <Button
                    variant="outline-primary"
                    size="sm"
                    className={`border-0 rounded-3 d-flex align-items-center justify-content-center toggle-btn ${isOpen ? 'ms-3' : 'mt-3'}`}
                    onClick={handleToggle}
                    style={{
                        width: '40px', height: '40px', padding: 0,
                    }}>
                    {isOpen ? <PanelLeftClose size={20}/> : <PanelLeftOpen size={20}/>}
                </Button>
            </div>

        )}

        <Nav className="flex-column px-2">
            {menuItems.map((item) => {
                const isActive = activeItem === item.href;
                return (<Nav.Item key={item.title} className="mb-2">
                    <Link
                        href={item.href}
                        onClick={() => {
                            setActiveItem(item.href);
                            if (isOffcanvas) {
                                setShowOffCanvas(false);
                            }
                        }}
                        className={`nav-link d-flex align-items-center
                                    ${!isOpen && !isOffcanvas ? 'justify-content-center' : ''} rounded-3 py-2 px-3
                                    ${isActive ? 'active bg-primary text-white' : 'text-dark'} hover-effect`}>
                        <div
                            className={`icon-wrapper ${isActive ? 'text-white' : 'text-primary'}`}>{item.icon}</div>
                        <span
                            className={`ms-3 fw-medium ${!isOpen && !isOffcanvas ? 'd-none' : ''}`}>{item.title}</span>
                    </Link>
                </Nav.Item>)
            })}
        </Nav>
        <hr className="my-3"/>
        <div className="px-3 mt-auto mb-3">

            <Button
                variant="danger"
                onClick={handleLogout}
                className="w-100 d-flex align-items-center justify-content-center py-2 rounded-3">
                <LogOut size={20}/>
                <span className={`ms-2 ${!isOpen && !isOffcanvas ? 'd-none' : ''}`}>Sair</span>
            </Button>
        </div>
    </>);


    return (<>
        <div
            className={'sidebar-desktop d-none d-md-flex flex-column border-end shadow-sm'}
            style={{
                width: isOpen ? '280px' : '80px',
                height: '100vh',
                position: 'fixed',
                transition: 'width 0.3s ease',
                zIndex: 1030
            }}>
            <SidebarContent isOffcanvas={false}/>
        </div>

        <Navbar className="d-md-none shadow-sm" fixed="top">
            <Container fluid className="px-3">
                <div className="d-flex align-items-center">
                    <Button
                        variant="light"
                        onClick={() => setShowOffCanvas(true)}
                        className="border-0"
                        style={{width: '45px', height: '45px'}}>
                        <Menu size={24}/>
                    </Button>
                    <Navbar.Brand className="d-flex align-items-center">
                        <Image
                            src={Logo}
                            alt="Nutrelli Logo"
                            width={40}
                            height={40}
                            className="img-fluid"
                            priority/>
                        <span className="ms-2 fw-semibold">Nutrelli Funcionário</span>
                    </Navbar.Brand>
                </div>
            </Container>
        </Navbar>

        <Offcanvas
            show={showOffCanvas}
            onHide={() => setShowOffCanvas(false)}
            className="d-md-none"
            placement="start">
            <Offcanvas.Header closeButton className="border-bottom">
                <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0">
                <SidebarContent isOffcanvas={true}/>
            </Offcanvas.Body>
        </Offcanvas>

    </>);
}