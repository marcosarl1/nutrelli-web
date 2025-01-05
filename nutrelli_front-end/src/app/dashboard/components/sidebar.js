'use client';

import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";

import {PanelLeftOpen, PanelLeftClose, Box, ShoppingCart, Users, Layers, LogOut} from "lucide-react";
import Logo from '../../../../public/nutrelli-logo.png';
import './sidebar.css'

export default function Sidebar({isOpen, setIsOpen}) {
    const [activeItem, setActiveItem] = useState('');

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setIsOpen]);

    const menuItems = [
        {title: 'Produtos', icon: <Box size={20}/>, href: '/dashboard/produtos'},
        {title: 'Pedidos', icon: <ShoppingCart size={20}/>, href: '/dashboard/pedidos'},
        {title: 'Clientes', icon: <Users size={20}/>, href: '/dashboard/clientes'},
        {title: 'Estoque', icon: <Layers size={20}/>, href: '/dashboard/estoque'},
    ];
    const logoSize = isOpen ? 120 : 60;
    return (
        <div className="sidebar d-flex flex-column border-end position-fixed"
             style={{
                 width: isOpen ? '280px' : '80px',
                 minHeight: '100vh',
                 transition: 'all 0.3s ease',
                 boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
             }}>
            <div className="d-flex align-items-center p-3"
                 style={{
                     flexDirection: isOpen ? 'row' : 'column',
                     justifyContent: isOpen ? 'space-between' : 'center',
                     gap: isOpen ? '0' : '10px',
                 }}>
                <Link href="/" className="text-decoration-none">
                    <div className="rounded-circle bg-white position-relative"
                         style={{
                             width: `${logoSize}px`,
                             height: `${logoSize}px`,
                             transition: 'all 0.3s ease'
                         }}>
                        <Image src={Logo} alt="Nutrelli Logo"
                               fill
                               sizes={`${logoSize}px`}
                               className="object-fit-contain"
                               priority/>
                    </div>
                </Link>
                <button className="btn btn-sm d-flex align-items-center justify-content-center p-2 mt-3"
                        onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <PanelLeftClose/> : <PanelLeftOpen/>}
                </button>
            </div>
            <hr/>
            <nav className="flex-grow-1">
                <ul className="nav nav-pills flex-column px-3">
                    {menuItems.map((item) => {
                            const isActive = activeItem === item.href;
                            return (
                                <li key={item.title} className="nav-item mb-2">
                                    <Link href={item.href}
                                          onClick={() => setActiveItem(item.href)}
                                          className={`nav-link d-flex align-items-center rounded-3 py-3 px-3 
                                          ${isActive ? 'active bg-primary text-white' : 'text-dark'} 
                                          hover-effect`}>
                                        <div className={isActive ? 'text-white' : 'text-dark'}>
                                            {item.icon}
                                        </div>
                                        <span className={`ms-3 ${!isOpen ? 'd-none' : ''}`}
                                        style={{
                                            whiteSpace: 'nowrap',
                                            opacity: isOpen ? 1 : 0,
                                            transition: 'opacity 0.3s ease'
                                        }}>{item.title}</span>
                                    </Link>
                                </li>
                            )
                        }
                    )}
                </ul>
            </nav>
            <hr/>
            <div className="p-3 mt-auto">
                <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center py-2">
                    <LogOut size={20}/>
                    <span className={`ms-2 ${!isOpen ? 'd-none' : ''}`}
                          style={{}}>Sair</span>
                </button>
            </div>
        </div>
    );
}