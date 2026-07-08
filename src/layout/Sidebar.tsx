import React, { useState } from 'react';
import {
    Rocket,
    BarChart3,
    MessageSquare,
    Calendar,
    Users,
    Filter,
    CreditCard,
    LayoutGrid,
    Zap,
    Globe,
    GraduationCap,
    Star,
    FileText,
    Box,
    Award,
    LineChart,
    Image,
    Facebook,
    Settings,
    MapPin,
    Brain,
    Phone,
    Mail,
    MessageCircle,
    Info,
    Truck,
} from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
    activeModule?: string;
    onModuleChange?: (module: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule = 'Contacts', onModuleChange }) => {
    const { t, i18n } = useTranslation();

    // Profile State
    const [profileName] = useState(() => localStorage.getItem('ghl_profile_name') || 'AI, BI and IT Solutions');
    const [profileLogo] = useState('/itc-logo.jpg');

    const menuItems = [
        { icon: MapPin, label: '3D Tour', id: 'Property Tour', tKey: '3D Tour' },
        { icon: Rocket, label: 'Launchpad', id: 'Launchpad', tKey: 'sidebar.launchpad' },
        { icon: BarChart3, label: 'Dashboard', id: 'Dashboard', tKey: 'sidebar.dashboard' },
        { icon: MessageSquare, label: 'Conversations', id: 'Conversations', tKey: 'sidebar.conversations' },
        { icon: Calendar, label: 'Calendars', id: 'Calendars', tKey: 'sidebar.calendars' },
        { icon: Users, label: 'Contacts', id: 'Contacts', tKey: 'sidebar.contacts' },
        { icon: Filter, label: 'Opportunities', id: 'Opportunities', tKey: 'sidebar.opportunities' },
        { icon: CreditCard, label: 'Payments', id: 'Payments', tKey: 'sidebar.payments' },
        { icon: LayoutGrid, label: 'Marketing', id: 'Marketing', tKey: 'sidebar.marketing' },
        { icon: Zap, label: 'Automation', id: 'Automation', tKey: 'sidebar.automation' },
        { icon: Globe, label: 'Sites', id: 'Sites', tKey: 'sidebar.sites' },
        { icon: GraduationCap, label: 'Memberships', id: 'Memberships', tKey: 'sidebar.memberships' },
        { icon: Star, label: 'Reputation', id: 'Reputation', tKey: 'sidebar.reputation' },
        { icon: FileText, label: 'Reporting', id: 'Reporting', tKey: 'sidebar.reporting' },
        { icon: Box, label: 'App Marketplace', id: 'App Marketplace', tKey: 'sidebar.marketplace' },
        { icon: Award, label: 'Affiliate Portal', id: 'Affiliate Portal', tKey: 'sidebar.affiliate' },
        { icon: LineChart, label: 'Agency Analytics', id: 'Agency Analytics', tKey: 'sidebar.agency_analytics' },
        { icon: Image, label: 'Media Library', id: 'Media Library', tKey: 'sidebar.media_library' },
        { icon: Facebook, label: 'Facebook Group', id: 'Facebook Group', tKey: 'sidebar.facebook_group' },
        { icon: Brain, label: 'AI Solutions', id: 'AI Solutions', tKey: 'sidebar.ai_solutions' },
        { icon: Truck, label: 'trucks', id: 'trucks', tKey: 'trucks' }
    ];

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
    };

    return (
        <div className="w-20 lg:w-64 h-full bg-[#1e293b] flex flex-col shrink-0 border-r border-[#334155] transition-all duration-300 relative">

            {/* Top Profile Section */}
            <div className="p-4 border-b border-[#334155] bg-slate-800/50">
                <div className="flex items-center gap-3 relative group">
                    <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-lg ring-1 ring-white/20 overflow-hidden shrink-0 transform transition-transform group-hover:scale-110 duration-300">
                        <img src={profileLogo} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="hidden lg:block overflow-hidden flex-1">
                        <h2 className="text-white font-bold text-xs tracking-wide uppercase truncate">
                            {profileName}
                        </h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-black text-ghl-blue tracking-tighter uppercase px-1.5 py-0.5 rounded bg-ghl-blue/10 border border-ghl-blue/20">
                                Agency
                            </span>
                            <button
                                onClick={toggleLanguage}
                                className="text-[9px] text-[#94a3b8] hover:text-white font-mono uppercase bg-slate-700/50 px-1.5 py-0.5 rounded transition-colors"
                            >
                                {i18n.language}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto px-2 py-4 custom-scrollbar">
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                if ('url' in item && (item as any).url) {
                                    window.open((item as any).url as string, '_blank');
                                    return;
                                }
                                console.log('Sidebar: clicking module', item.id);
                                onModuleChange?.(item.id);
                            }}
                            className={clsx(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                activeModule === item.id
                                    ? "bg-blue-600/10 text-blue-400 font-semibold border-l-4 border-blue-600 rtl:border-l-0 rtl:border-r-4"
                                    : "text-[#94a3b8] hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon
                                size={22}
                                className={clsx(
                                    "transition-transform duration-200 group-hover:scale-110 shrink-0",
                                    activeModule === item.id ? "text-blue-500" : "text-[#64748b]"
                                )}
                            />
                            <span className="hidden lg:block text-sm truncate font-medium">
                                {t(item.tKey)}
                            </span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Bottom Footer Section */}
            <div className="p-3 border-t border-[#334155]">
                <button
                    onClick={() => onModuleChange?.('Settings')}
                    className={clsx(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#94a3b8] hover:bg-slate-800 hover:text-white transition-all group mb-2",
                        activeModule === 'Settings' && "bg-blue-600/10 text-blue-400"
                    )}
                >
                    <Settings size={18} className="group-hover:rotate-45 transition-transform duration-300" />
                    <span className="hidden lg:block text-sm font-medium">{t('common.settings')}</span>
                </button>

                {/* Contact Info */}
                <div className="hidden lg:block pt-3 border-t border-[#334155/30]">
                    <div className="grid grid-cols-1 gap-1.5">
                        <a
                            href="tel:+966545450613"
                            className="flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors group"
                        >
                            <Phone size={14} className="shrink-0" />
                            <span className="text-[11px]">+966545450613</span>
                        </a>

                        <a
                            href="https://wa.me/966545450613"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors group"
                        >
                            <MessageCircle size={14} className="shrink-0" />
                            <span className="text-[11px]">+966545450613</span>
                        </a>

                        <a
                            href="mailto:itc@itcyanbu.net"
                            className="flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors group"
                        >
                            <Mail size={14} className="shrink-0" />
                            <span className="text-[11px] truncate">itc@itcyanbu.net</span>
                        </a>

                        <a
                            href="https://preview--itcyanbu-digital-blueprint.lovable.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group mt-1"
                        >
                            <Info size={14} className="shrink-0" />
                            <span className="text-[11px] border-b border-blue-400/30">Who are we ?</span>
                        </a>

                        <div className="mt-2 text-[9px] text-[#64748b] leading-tight pl-1 border-l border-[#334155] ml-1">
                            <p>Saudi Arabia - Royal Commission of Yanbu</p>
                            <p>Sumairi Area - Office 18</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
