import { useState, useEffect } from 'react';
import {
    User,
    Users,
    GitBranch,
    Calendar,
    Phone,
    MessageSquare,
    Star,
    Settings as SettingsIcon,
    Database,
    Globe,
    Image,
    ArrowLeftRight,
    Layers,
    Mail,
    Tag,
    FileText,
    Beaker,
    History,
    Upload,
    HelpCircle,
    Bot
} from 'lucide-react';
import BusinessProfileCard from '../components/settings/BusinessProfileCard';
import MyStaffView from '../components/settings/MyStaffView';
import StaffModal from '../components/settings/StaffModal';
import PipelinesSettings from '../components/settings/PipelinesSettings';
import {
    CalendarsSettings,
    PhoneNumbersSettings,
    WhatsAppSettings,
    ReputationSettings
} from '../components/settings/BatchOneSettings';
import {
    CustomFieldsSettings,
    CustomValuesSettings,
    DomainsSettings,
    MediaLibrarySettings,
    UrlRedirectsSettings
} from '../components/settings/BatchTwoSettings';
import {
    IntegrationsSettings,
    ConversationProvidersSettings,
    EmailServicesSettings,
    TagManagementSettings
} from '../components/settings/BatchThreeSettings';
import {
    SmsEmailTemplatesSettings,
    LabsSettings,
    AuditLogsSettings
} from '../components/settings/BatchFourSettings';
import ConversationAiSettings from '../components/settings/ConversationAiSettings';
import clsx from 'clsx';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('Business Profile');
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

    const [settings, setSettings] = useState({
        // General Information
        logo: null as string | null,
        friendlyName: 'itcyanbu',
        legalName: 'itcyanbu',
        email: 'itc@itcyanbu.net',
        phone: '+966545450613',
        website: 'https://itcyanbu.net',
        niche: 'Technology',
        brandedDomain: '',
        locationId: 'LOC-12345-67890',
        apiKey: '6b89-4a7b-8c9d-1e2f3g4h5i6j',

        // Physical Address
        streetAddress: 'Royal Commission',
        city: 'Yanbu',
        stateProvince: 'Al Madinah',
        zipCode: '46424', // Approximate zip for Yanbu Industrial City
        country: 'Saudi Arabia',
        timeZone: '(GMT+03:00) Riyadh',
        platformLanguage: 'English',
        outboundCommunicationLanguage: 'Default (English)',

        // Business Information
        businessType: 'Corporation',
        businessIndustry: 'Technology',
        registrationIdType: 'Tax ID',
        registrationNumber: '',
        regionsOfOperations: ['Saudi Arabia', 'Middle East'],

        // Authorized Representative
        authorizedRep: {
            fullName: '',
            email: 'itc@itcyanbu.net',
            phone: '+966545450613',
            jobTitle: ''
        },

        // General Settings
        general: {
            allowDuplicateOpportunity: false,
            mergeFB: false,
            disableTimezone: false,
            validatePhone: false,
            verifyEmail: false,
            hardBounce: false,
            smsCompliantOptOut: true,
            smsCompliantSender: true,
            emailCompliantUnsubscribe: true,
        },

        // Call & Voicemail
        voicemail: {
            timeout: 20,
            file: null as string | null
        },

        // Missed Call Text Back
        missedCallTextBack: {
            enabled: true,
            message: 'Hi, this is AI, BI and IT Solutions. Sorry we missed your call. How can we help you?'
        },

        // Contact Duplication
        duplication: {
            allowDuplicate: false,
            priority: ['Email', 'Phone Number']
        },

        // Conversation AI
        conversationAi: {
            mode: 'OFF',
            guidedForm: {
                variedPhrasing: true,
                toneAdjustment: true,
                refocusing: true
            }
        }
    });

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('ghl_business_settings');
        if (savedSettings) {
            try {
                setSettings(JSON.parse(savedSettings));
            } catch (e) {
                console.error('Failed to parse saved settings', e);
            }
        }
    }, []);

    const handleSave = async (section: string) => {
        setLoadingStates(prev => ({ ...prev, [section]: true }));
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Persist all settings to localStorage
        localStorage.setItem('ghl_business_settings', JSON.stringify(settings));

        setLoadingStates(prev => ({ ...prev, [section]: false }));
    };

    const updateSetting = (path: string, value: any) => {
        setSettings(prev => {
            const keys = path.split('.');

            const updateImmutable = (obj: any, keys: string[], val: any): any => {
                const [currentKey, ...rest] = keys;

                if (rest.length === 0) {
                    return { ...obj, [currentKey]: val };
                }

                return {
                    ...obj,
                    [currentKey]: updateImmutable(obj[currentKey] || {}, rest, val)
                };
            };

            return updateImmutable(prev, keys, value);
        });
    };

    const handleLogoChange = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (re) => {
                    updateSetting('logo', re.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const regenerateApiKey = () => {
        const newKey = Array.from({ length: 4 }, () => Math.random().toString(36).substring(2, 6)).join('-');
        updateSetting('apiKey', newKey);
    };

    const sidebarItems = [
        { icon: User, label: 'Business Profile' },
        { icon: Users, label: 'My Staff' },
        { icon: GitBranch, label: 'Pipelines' },
        { icon: Calendar, label: 'Calendars' },
        { icon: Phone, label: 'Phone Numbers' },
        { icon: MessageSquare, label: 'WhatsApp' },
        { icon: Star, label: 'Reputation Management' },
        { icon: SettingsIcon, label: 'Custom Fields' },
        { icon: Database, label: 'Custom Values' },
        { icon: Globe, label: 'Domains' },
        { icon: Image, label: 'Media Library (New)' },
        { icon: ArrowLeftRight, label: 'URL Redirects' },
        { icon: Layers, label: 'Integrations' },
        { icon: MessageSquare, label: 'Conversation Providers' },
        { icon: Mail, label: 'Email Services' },
        { icon: Tag, label: 'Tag Management' },
        { icon: FileText, label: 'SMS & Email Templates' },
        { icon: Beaker, label: 'Labs' },
        { icon: Bot, label: 'Conversation AI' },
        { icon: History, label: 'Audit Logs' },
    ];

    const renderBusinessProfile = () => (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* General Information */}
            <BusinessProfileCard
                title="General Information"
                description="This information will be used for your sub-account profile"
                onSave={() => handleSave('generalInfo')}
                isLoading={loadingStates['generalInfo']}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full flex items-center gap-6 mb-4">
                        <div
                            className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 relative group cursor-pointer overflow-hidden text-center"
                            onClick={handleLogoChange}
                        >
                            {settings.logo ? (
                                <img src={settings.logo} alt="Business Logo" className="w-full h-full object-contain" />
                            ) : (
                                <Upload className="text-gray-400 group-hover:text-ghl-blue transition-colors" size={32} />
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all rounded-lg" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-1">Business Logo</h4>
                            <p className="text-sm text-gray-500 mb-3">Upload your business logo. Recommended size: 250x250px</p>
                            <button onClick={handleLogoChange} className="text-ghl-blue text-sm font-semibold hover:underline">Change Logo</button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Friendly Business Name</label>
                            <input
                                type="text"
                                value={settings.friendlyName}
                                onChange={(e) => updateSetting('friendlyName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Legal Business Name</label>
                            <input
                                type="text"
                                value={settings.legalName}
                                onChange={(e) => updateSetting('legalName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none"
                                placeholder="Enter legal name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => updateSetting('email', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
                            <input
                                type="tel"
                                value={settings.phone}
                                onChange={(e) => updateSetting('phone', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Website</label>
                            <input
                                type="url"
                                value={settings.website}
                                onChange={(e) => updateSetting('website', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none"
                                placeholder="https://example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Niche</label>
                            <select
                                value={settings.niche}
                                onChange={(e) => updateSetting('niche', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none bg-white"
                            >
                                <option>Software / SaaS</option>
                                <option>Marketing Agency</option>
                                <option>Real Estate</option>
                                <option>E-commerce</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-span-full pt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location ID</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={settings.locationId}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Branded Domain</label>
                                <input
                                    type="text"
                                    value={settings.brandedDomain}
                                    onChange={(e) => updateSetting('brandedDomain', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none"
                                    placeholder="links.example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                API Key
                                <HelpCircle size={14} className="text-gray-400 cursor-help" />
                            </label>
                            <div className="flex gap-2">
                                <input type="text" readOnly value={settings.apiKey} className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 font-mono text-sm" />
                                <button onClick={regenerateApiKey} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium transition-colors">Regenerate</button>
                            </div>
                        </div>
                    </div>
                </div>
            </BusinessProfileCard>

            {/* Business Physical Address */}
            <BusinessProfileCard
                title="Business Physical Address"
                description="This address will be used for compliance and registration"
                onSave={() => handleSave('address')}
                isLoading={loadingStates['address']}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <input
                            type="text"
                            value={settings.streetAddress}
                            onChange={(e) => updateSetting('streetAddress', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none"
                            placeholder="123 Business Way"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                            type="text"
                            value={settings.city}
                            onChange={(e) => updateSetting('city', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none"
                            placeholder="New York"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                            <input
                                type="text"
                                value={settings.stateProvince}
                                onChange={(e) => updateSetting('stateProvince', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none"
                                placeholder="NY"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                            <input
                                type="text"
                                value={settings.zipCode}
                                onChange={(e) => updateSetting('zipCode', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none"
                                placeholder="10001"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <select
                            value={settings.country}
                            onChange={(e) => updateSetting('country', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none bg-white"
                        >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>United Kingdom</option>
                            <option>Saudi Arabia</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                        <select
                            value={settings.timeZone}
                            onChange={(e) => updateSetting('timeZone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none bg-white"
                        >
                            <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                            <option>(GMT+03:00) Riyadh</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform Language</label>
                        <select
                            value={settings.platformLanguage}
                            onChange={(e) => updateSetting('platformLanguage', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none bg-white"
                        >
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                            <option>Arabic</option>
                        </select>
                    </div>
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Outbound Communication Language</label>
                        <select
                            value={settings.outboundCommunicationLanguage}
                            onChange={(e) => updateSetting('outboundCommunicationLanguage', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none bg-white"
                        >
                            <option>Default (English)</option>
                            <option>Spanish</option>
                            <option>Arabic</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Controls the language for Custom Fields and Custom Values in outgoing messages</p>
                    </div>
                </div>
            </BusinessProfileCard>

            {/* General Settings */}
            <BusinessProfileCard
                title="General Settings"
                onSave={() => handleSave('generalSettings')}
                isLoading={loadingStates['generalSettings']}
            >
                <div className="space-y-4">
                    {[
                        { key: 'allowDuplicateOpportunity', label: 'Allow Duplicate Opportunity', desc: 'Allows multiple opportunities for the same contact in a single pipeline' },
                        { key: 'mergeFB', label: 'Merge Facebook Contacts by Name', desc: 'Automatically merges contacts with identical names from Facebook' },
                        { key: 'disableTimezone', label: 'Disable Contact Timezone', desc: 'Force all automated communication to use business timezone' },
                        { key: 'validatePhone', label: 'Validate Phone Numbers', desc: 'Validate phone numbers when the first SMS is sent' },
                        { key: 'verifyEmail', label: 'Verify Email Address', desc: 'Verify email when the first email is sent to a new contact' },
                        { key: 'hardBounce', label: 'Mark Emails as Unverified due to Hard Bounce', desc: 'Automatically skip email actions for hard-bouncing addresses' },
                        { key: 'smsCompliantOptOut', label: 'Make SMS Compliant', desc: 'Add opt-out message (e.g., Reply STOP to unsubscribe)' },
                        { key: 'smsCompliantSender', label: 'Make SMS Compliant by Adding Sender Information', desc: 'Include business name in all outgoing SMS messages' },
                        { key: 'emailCompliantUnsubscribe', label: 'Make Email Compliant', desc: 'Add an Unsubscribe Link in your emails automatically' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={(settings.general as any)[item.key]}
                                    onChange={(e) => updateSetting(`general.${item.key}`, e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ghl-blue"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </BusinessProfileCard>

            {/* Business Information */}
            <BusinessProfileCard
                title="Business Information"
                description="Information used for business registration and compliance"
                onSave={() => handleSave('businessInfo')}
                isLoading={loadingStates['businessInfo']}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                        <select
                            value={settings.businessType}
                            onChange={(e) => updateSetting('businessType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none bg-white"
                        >
                            <option>Corporation</option>
                            <option>Limited Liability Company (LLC)</option>
                            <option>Sole-Proprietorship</option>
                            <option>Non-profit Corporation</option>
                            <option>Partnership</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Industry</label>
                        <select
                            value={settings.businessIndustry}
                            onChange={(e) => updateSetting('businessIndustry', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none bg-white"
                        >
                            <option>Technology</option>
                            <option>Marketing</option>
                            <option>Real Estate</option>
                            <option>Health & Wellness</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration ID Type</label>
                        <select
                            value={settings.registrationIdType}
                            onChange={(e) => updateSetting('registrationIdType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none bg-white"
                        >
                            <option>EIN (US)</option>
                            <option>VAT (EU)</option>
                            <option>Tax ID</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                        <input
                            type="text"
                            value={settings.registrationNumber}
                            onChange={(e) => updateSetting('registrationNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none"
                            placeholder="Enter number"
                        />
                    </div>
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Regions of Operations</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {settings.regionsOfOperations.map(region => (
                                <span key={region} className="bg-blue-50 text-ghl-blue px-2 py-1 rounded text-xs font-medium flex items-center gap-1 border border-blue-100">
                                    {region}
                                    <button onClick={() => updateSetting('regionsOfOperations', settings.regionsOfOperations.filter(r => r !== region))} className="hover:text-blue-800">×</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none text-sm"
                                placeholder="Add region (e.g. North America)"
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter' && e.target.value) {
                                        updateSetting('regionsOfOperations', [...settings.regionsOfOperations, e.target.value]);
                                        e.target.value = '';
                                    }
                                }}
                            />
                            <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium">Add</button>
                        </div>
                    </div>
                </div>
            </BusinessProfileCard>

            {/* Authorized Representative */}
            <BusinessProfileCard
                title="Authorized Representative"
                description="The person authorized to act on behalf of the business"
                onSave={() => handleSave('authRep')}
                isLoading={loadingStates['authRep']}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={settings.authorizedRep.fullName}
                            onChange={(e) => updateSetting('authorizedRep.fullName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            value={settings.authorizedRep.email}
                            onChange={(e) => updateSetting('authorizedRep.email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            value={settings.authorizedRep.phone}
                            onChange={(e) => updateSetting('authorizedRep.phone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                        <input
                            type="text"
                            value={settings.authorizedRep.jobTitle}
                            onChange={(e) => updateSetting('authorizedRep.jobTitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none"
                            placeholder="CEO / Manager"
                        />
                    </div>
                </div>
            </BusinessProfileCard>

            {/* Missed Call Text Back */}
            <BusinessProfileCard
                title="Missed Call Text Back"
                onSave={() => handleSave('missedCall')}
                isLoading={loadingStates['missedCall']}
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <h4 className="text-sm font-medium text-gray-900">Enable Missed Call Text Back</h4>
                            <p className="text-xs text-gray-500">Automatically send a text when you miss a call</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.missedCallTextBack.enabled}
                                onChange={(e) => updateSetting('missedCallTextBack.enabled', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ghl-blue"></div>
                        </label>
                    </div>
                    <div className="pt-2 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea
                                rows={3}
                                value={settings.missedCallTextBack.message}
                                onChange={(e) => updateSetting('missedCallTextBack.message', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-ghl-blue outline-none resize-none text-sm"
                            />
                            <p className="text-xs text-gray-400 mt-2">Maximum 160 characters</p>
                        </div>
                        <div className="flex items-end gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Test Phone Number</label>
                                <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm" placeholder="+1 (555) 000-0000" />
                            </div>
                            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-white text-sm font-medium transition-colors">
                                Send Test
                            </button>
                        </div>
                    </div>
                </div>
            </BusinessProfileCard>

            {/* Depreciated Features */}
            <BusinessProfileCard title="Enable/Disable Depreciated Features">
                <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-amber-800">
                            <strong>Note:</strong> Depreciated features are no longer updated or supported.
                            Workflows have completely replaced Campaigns and Triggers as a superior option.
                        </p>
                    </div>
                    {['Campaigns', 'Triggers'].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">{item}</h4>
                                <p className="text-xs text-gray-500">Phasing out in favor of Workflows</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ghl-blue"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </BusinessProfileCard>

            {/* Call & Voicemail Settings */}
            <BusinessProfileCard
                title="Call & Voicemail Settings"
                onSave={() => handleSave('voicemail')}
                isLoading={loadingStates['voicemail']}
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Voicemail Recording</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center">
                            <Upload className="text-gray-400 mb-2" size={24} />
                            <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-400">MP3 or WAV files supported (Max 5MB)</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Incoming Call Timeout</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min="5"
                                max="60"
                                step="5"
                                value={settings.voicemail.timeout}
                                onChange={(e) => updateSetting('voicemail.timeout', parseInt(e.target.value))}
                                className="flex-1 accent-ghl-blue"
                            />
                            <span className="text-sm font-medium text-gray-900 w-12 text-right">{settings.voicemail.timeout}s</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Determines how long a call rings before going to voicemail</p>
                    </div>
                </div>
            </BusinessProfileCard>

            {/* Contact Duplication Preferences */}
            <BusinessProfileCard
                title="Contact Duplication Preferences"
                onSave={() => handleSave('duplication')}
                isLoading={loadingStates['duplication']}
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                        <div>
                            <h4 className="text-sm font-semibold text-blue-900">Allow Duplicate Contacts</h4>
                            <p className="text-xs text-blue-700">Allow multiple contacts with the same email or phone</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.duplication.allowDuplicate}
                                onChange={(e) => updateSetting('duplication.allowDuplicate', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {!settings.duplication.allowDuplicate && (
                        <div className="space-y-3 pt-2">
                            <label className="block text-sm font-medium text-gray-700">Deduplication Priority</label>
                            <div className="flex flex-col gap-2">
                                {settings.duplication.priority.map((type, i) => (
                                    <div key={type} className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-white">
                                        <span className="text-sm text-gray-900 font-medium">{i + 1}. {type}</span>
                                        <div className="flex gap-1">
                                            <button className="p-1 hover:bg-gray-100 rounded">↑</button>
                                            <button className="p-1 hover:bg-gray-100 rounded">↓</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </BusinessProfileCard>
        </div>
    );

    return (
        <div className="flex-1 flex h-full overflow-hidden bg-gray-50">
            {/* Settings Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 h-full">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Settings <span className="text-xs text-gray-400 font-normal">v3.6 (Interactive)</span></h2>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => setActiveTab(item.label)}
                            className={clsx(
                                "w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                                activeTab === item.label
                                    ? "bg-blue-50 text-ghl-blue border-r-4 border-ghl-blue"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon size={18} className={activeTab === item.label ? "text-ghl-blue" : "text-gray-400"} />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-8 py-6 bg-white border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <span>Settings</span>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">{activeTab}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{activeTab}</h1>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {activeTab === 'Business Profile' && renderBusinessProfile()}
                    {activeTab === 'My Staff' && (
                        <div className="max-w-6xl mx-auto">
                            <MyStaffView onAddClick={() => setIsStaffModalOpen(true)} />
                        </div>
                    )}
                    {activeTab === 'Pipelines' && <PipelinesSettings />}
                    {activeTab === 'Calendars' && <CalendarsSettings />}
                    {activeTab === 'Phone Numbers' && <PhoneNumbersSettings />}
                    {activeTab === 'WhatsApp' && <WhatsAppSettings />}
                    {activeTab === 'Reputation Management' && <ReputationSettings />}
                    {activeTab === 'Custom Fields' && <CustomFieldsSettings />}
                    {activeTab === 'Custom Values' && <CustomValuesSettings />}
                    {activeTab === 'Domains' && <DomainsSettings />}
                    {activeTab === 'Media Library' && <MediaLibrarySettings />}
                    {activeTab === 'URL Redirects' && <UrlRedirectsSettings />}
                    {activeTab === 'Integrations' && <IntegrationsSettings />}
                    {activeTab === 'Conversation Providers' && <ConversationProvidersSettings />}
                    {activeTab === 'Email Services' && <EmailServicesSettings />}
                    {activeTab === 'Tag Management' && <TagManagementSettings />}
                    {activeTab === 'SMS & Email Templates' && <SmsEmailTemplatesSettings />}
                    {activeTab === 'Labs' && <LabsSettings />}
                    {activeTab === 'Conversation AI' && <ConversationAiSettings settings={settings} onUpdate={updateSetting} />}
                    {activeTab === 'Audit Logs' && <AuditLogsSettings />}
                </div>
            </div>

            <StaffModal
                isOpen={isStaffModalOpen}
                onClose={() => setIsStaffModalOpen(false)}
            />
        </div>
    );
};

export default SettingsPage;
