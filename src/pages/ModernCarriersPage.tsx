import { useState, useEffect } from 'react';
import { Truck, Navigation, FileText, Users, ExternalLink, Loader2, Lock } from 'lucide-react';

interface FleetItem { id: number; type: string; plate: string; model: number; expiry: string; }
interface CustodyItem { id: number; driverName: string; idNumber: number; type: string; status: string; }
interface DeviceItem { id: number; type: string; truck: string; serial?: string; status: string; }
interface DriverItem { id: number; name: string; plate: string; licenseExpiry: string; phone: number; }

export default function ModernCarriersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('modern_carriers_auth') === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [data, setData] = useState<{
    fleet: FleetItem[];
    custody: CustodyItem[];
    devices: DeviceItem[];
    drivers: DriverItem[];
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('fleet');

  useEffect(() => {
    fetch('/data/nwagl.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="animate-spin text-ghl-blue" size={40} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 p-4" dir="rtl">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">القسم محمي بكلمة مرور</h2>
          <p className="text-gray-500 mb-6">الرجاء إدخال كلمة المرور للوصول إلى بيانات مؤسسة نواقل</p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            if (password === 'Itcyanbu123@') {
              sessionStorage.setItem('modern_carriers_auth', 'true');
              setIsAuthenticated(true);
              setError('');
            } else {
              setError('كلمة المرور غير صحيحة');
            }
          }}>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="ltr"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto bg-gray-50 text-gray-800" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">بيانات مؤسسة نواقل</h1>
          <p className="text-gray-500">سجل جرد أسطول الشاحنات والمعدات والبيانات</p>
        </div>
        <a 
          href="https://modern-carriers.lovable.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <span>فتح تطبيق Modern Carriers</span>
          <ExternalLink size={18} />
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b pb-2">
        <button 
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition ${activeTab === 'fleet' ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <Truck size={18} /> اسطول الشاحنات والمقطورات
        </button>
        <button 
          onClick={() => setActiveTab('drivers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition ${activeTab === 'drivers' ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <Users size={18} /> بيانات السائقين
        </button>
        <button 
          onClick={() => setActiveTab('custody')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition ${activeTab === 'custody' ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <FileText size={18} /> العهد والمعدات
        </button>
        <button 
          onClick={() => setActiveTab('devices')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition ${activeTab === 'devices' ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <Navigation size={18} /> أجهزة التتبع والتقنيات
        </button>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {data && activeTab === 'fleet' && (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3">م</th>
                  <th className="p-3">نوع المركبة</th>
                  <th className="p-3">رقم اللوحة</th>
                  <th className="p-3">الموديل</th>
                  <th className="p-3">تاريخ الانتهاء</th>
                </tr>
              </thead>
              <tbody>
                {data.fleet.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.id}</td>
                    <td className="p-3 font-semibold">{item.type}</td>
                    <td className="p-3 text-gray-600">{item.plate || '-'}</td>
                    <td className="p-3 text-gray-600">{item.model || '-'}</td>
                    <td className="p-3 text-gray-600">{item.expiry || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && activeTab === 'drivers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3">م</th>
                  <th className="p-3">اسم السائق</th>
                  <th className="p-3">رقم الجوال</th>
                  <th className="p-3">رقم اللوحة</th>
                  <th className="p-3">تاريخ انتهاء الرخصة</th>
                </tr>
              </thead>
              <tbody>
                {data.drivers.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.id}</td>
                    <td className="p-3 font-semibold">{item.name}</td>
                    <td className="p-3 text-blue-600">{item.phone || '-'}</td>
                    <td className="p-3 text-gray-600">{item.plate || '-'}</td>
                    <td className="p-3 text-gray-600">{item.licenseExpiry || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && activeTab === 'custody' && (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3">م</th>
                  <th className="p-3">اسم السائق</th>
                  <th className="p-3">رقم الهوية</th>
                  <th className="p-3">العهدة</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {data.custody.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.id}</td>
                    <td className="p-3 font-semibold">{item.driverName}</td>
                    <td className="p-3 text-gray-600">{item.idNumber || '-'}</td>
                    <td className="p-3 text-gray-600">{item.type || '-'}</td>
                    <td className="p-3 text-gray-600">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">{item.status || 'جيدة'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && activeTab === 'devices' && (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3">م</th>
                  <th className="p-3">نوع الجهاز</th>
                  <th className="p-3">المركب عليها</th>
                  <th className="p-3">الرقم / العدد</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {data.devices.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.id}</td>
                    <td className="p-3 font-semibold">{item.type}</td>
                    <td className="p-3 text-gray-600">{item.truck || '-'}</td>
                    <td className="p-3 text-gray-600">{item.serial || '-'}</td>
                    <td className="p-3 text-gray-600">
                      <span className={`px-2 py-1 rounded text-sm ${item.status === 'فعال' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.status || 'فعال'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
