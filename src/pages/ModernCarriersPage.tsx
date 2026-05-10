import { useState, useEffect } from 'react';
import { Truck, FileText, Users, ExternalLink, Loader2, Lock, Unlock, ClipboardList, Plus, Pencil, Trash2, X, Download, BarChart2, CheckCircle2, Circle, ListTodo, Map, ArrowRightLeft, Clock } from 'lucide-react';

interface FleetItem { id: number; type: string; plate: string; model: number; expiry: string; periodicInspection?: string; periodicMaintenance?: string; operatingCard?: string; driverCard?: string; aramcoCard?: string; }
interface CustodyItem { id: number; driverName: string; idNumber: number; type: string; status: string; }
interface DeviceItem { id: number; plate: string; sn: string; type: string; status: string; }
interface DriverItem { id: number; name: string; plate: string; licenseExpiry: string; phone: number; }
interface EmployeeItem { id: number; name: string; idNumber: number; license: string; phone: string; idExpiry: string; licenseExpiry: string; profession?: string; passportExpiry?: string; healthInsuranceExpiry?: string; }
interface TaskItem { id: number; title: string; assignedTo: string; status: 'completed' | 'pending' | 'in-progress'; date: string; }
interface TripItem { id: number; truck: string; driver: string; destination: string; departureDate: string; returnDate?: string; status: 'travelling' | 'returned'; }
interface AttendanceLog { id: number; employeeId: number; name: string; date: string; checkIn: string; checkOut?: string; }

export default function ModernCarriersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('modern_carriers_auth') === 'true');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('fleet');
  const [data, setData] = useState<{
    fleet: FleetItem[];
    custody: CustodyItem[];
    devices: DeviceItem[];
    drivers: DriverItem[];
    employees: EmployeeItem[];
    tasks: TaskItem[];
    trips: TripItem[];
    attendance: AttendanceLog[];
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<EmployeeItem | null>(null);
  const [newEmployee, setNewEmployee] = useState<Partial<EmployeeItem>>({});
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showFleetForm, setShowFleetForm] = useState(false);
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [newTask, setNewTask] = useState<Partial<TaskItem>>({ status: 'pending' });
  const [newFleet, setNewFleet] = useState<Partial<FleetItem & { sn: string, deviceType: string }>>({});
  const [newDriver, setNewDriver] = useState<Partial<DriverItem>>({});
  const [showTripForm, setShowTripForm] = useState(false);
  const [newTrip, setNewTrip] = useState<Partial<TripItem>>({ status: 'travelling' });

  useEffect(() => {
    fetch('/data/nwagl.json')
      .then(res => res.json())
      .then(json => {
        // Load persistent data from localStorage
        const savedEmployees = localStorage.getItem('modern_carriers_employees');
        if (savedEmployees) json.employees = JSON.parse(savedEmployees);
        
        const savedTasks = localStorage.getItem('modern_carriers_tasks');
        if (savedTasks) {
          json.tasks = JSON.parse(savedTasks);
        } else if (!json.tasks) {
          json.tasks = [
            { id: 1, title: 'فحص زيت الشاحنات الأسبوعي', assignedTo: 'أحمد الفكي', status: 'completed', date: '2026-05-01' },
            { id: 2, title: 'تجديد استمارة شاحنة 9849', assignedTo: 'إدارة', status: 'pending', date: '2026-05-10' },
            { id: 3, title: 'تركيب أجهزة تتبع جديدة', assignedTo: 'فني التقنية', status: 'pending', date: '2026-05-08' }
          ];
        }

        const savedTrips = localStorage.getItem('modern_carriers_trips');
        if (savedTrips) {
          json.trips = JSON.parse(savedTrips);
        } else if (!json.trips) {
          json.trips = [
            { id: 1, truck: '9849 أ ر ح', driver: 'رامشاندرا', destination: 'الرياض', departureDate: '2026-05-09 08:00', status: 'travelling' },
            { id: 2, truck: '9095 أ أ ر', driver: 'أحمد الفكي', destination: 'جدة', departureDate: '2026-05-08 10:00', returnDate: '2026-05-09 14:00', status: 'returned' }
          ];
        }

        const savedAttendance = localStorage.getItem('modern_carriers_attendance');
        if (savedAttendance) {
          json.attendance = JSON.parse(savedAttendance);
        } else if (!json.attendance) {
          json.attendance = [];
        }
        
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Itcyanbu123@') {
      setIsAuthenticated(true);
      sessionStorage.setItem('modern_carriers_auth', 'true');
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-white rounded-3xl shadow-sm border border-gray-100" dir="rtl">
        <div className="bg-blue-50 p-4 rounded-full mb-6">
          <Lock className="text-blue-600" size={48} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">منطقة محمية</h2>
        <p className="text-gray-500 mb-8 text-center max-w-xs">يرجى إدخال كلمة المرور للوصول إلى بيانات جرد مؤسسة نواقل</p>
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
          <input 
            type="password" 
            placeholder="كلمة المرور"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition text-center"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            دخول النظام
          </button>
        </form>
      </div>
    );
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500 pb-32" dir="rtl">
      {/* Version Banner */}
      <div className="bg-blue-600 text-white p-2 rounded-lg text-center mb-4 text-xs font-bold animate-pulse">
        تمت إضافة أعمدة بيانات الموظفين الجديدة - النسخة v1.4.3
      </div>
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">مؤسسة نواقل الحديثة للنقليات</h1>
          <p className="text-gray-500">لوحة التقارير والتتبع الذكية</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (!isAdminMode) {
                const pin = prompt('يرجى إدخال رمز المسؤول لتفعيل التعديل:');
                if (pin === '1234') { // Default admin PIN
                  setIsAdminMode(true);
                } else {
                  alert('الرمز خاطئ');
                }
              } else {
                setIsAdminMode(false);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition shadow-sm ${isAdminMode ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}
          >
            {isAdminMode ? <Unlock size={18} /> : <Lock size={18} />}
            <span>{isAdminMode ? 'وضع المسؤول نشط' : 'تفعيل وضع المسؤول'}</span>
          </button>
          <a 
            href="https://modern-carriers.lovable.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            <span>فتح تطبيق Modern Carriers</span>
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-2 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition whitespace-nowrap ${activeTab === 'fleet' ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <Truck size={18} /> أسطول الشاحنات وأجهزة التتبع
        </button>
        <button 
          onClick={() => setActiveTab('custody')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition whitespace-nowrap ${activeTab === 'custody' ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <FileText size={18} /> العهد والمعدات
        </button>
        <button 
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition whitespace-nowrap ${activeTab === 'employees' ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <ClipboardList size={18} /> نموذج بيانات ومتابعة الموظفين
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition whitespace-nowrap ${activeTab === 'tasks' ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <ListTodo size={18} /> المهام التشغيلية
        </button>
        <button 
          onClick={() => setActiveTab('trips')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition whitespace-nowrap ${activeTab === 'trips' ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <ArrowRightLeft size={18} /> حركة الأسطول
        </button>
        <button 
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition whitespace-nowrap ${activeTab === 'attendance' ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <Clock size={18} /> سجل الحضور
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition whitespace-nowrap ${activeTab === 'reports' ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <BarChart2 size={18} /> التقارير والتحليلات
        </button>
      </div>

      {/* Toolbar Area */}
      <div className="mb-4 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">
          {activeTab === 'fleet' && 'سجل الأسطول والتقنيات'}
          {activeTab === 'employees' && 'إدارة سجل الموظفين'}
          {activeTab === 'tasks' && 'سجل المهام اليومية'}
          {activeTab === 'trips' && 'سجل حركة الذهاب والعودة'}
          {activeTab === 'attendance' && 'سجل حضور وانصراف الموظفين'}
          {activeTab === 'reports' && 'لوحة التقارير الذكية'}
        </h3>
        <div className="flex gap-2">
             <button onClick={() => setShowFleetForm(true)} className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-black hover:bg-orange-700 transition shadow-lg shadow-orange-200 animate-bounce">
               <Plus size={20} /> إضافة شاحنة جديدة
             </button>
           )}
           {activeTab === 'attendance' && (
              <button onClick={() => {
                const tableData = data?.attendance || [];
                const headers = ["ID", "Employee Name", "Date", "Check-In", "Check-Out"];
                const csvRows = [headers.join(','), ...tableData.map(a => [a.id, `"${a.name}"`, a.date, a.checkIn, a.checkOut || ''].join(','))].join('\n');
                const link = document.createElement("a");
                link.setAttribute("href", encodeURI("data:text/csv;charset=utf-8,\uFEFF" + csvRows));
                link.setAttribute("download", "attendance_report.csv");
                link.click();
              }} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                <Download size={18} /> تصدير السجل
              </button>
           )}
           {activeTab === 'employees' && isAdminMode && (
             <>
               <button onClick={() => {
                 const tableData = data?.employees || [];
                 const headers = ["ID", "Name", "Profession", "ID Number", "License", "Phone", "ID Expiry", "License Expiry"];
                 const csvRows = [headers.join(','), ...tableData.map(e => [e.id, `"${e.name}"`, `"${e.profession || ''}"`, e.idNumber, `"${e.license}"`, e.phone, e.idExpiry, e.licenseExpiry].join(','))].join('\n');
                 const link = document.createElement("a");
                 link.setAttribute("href", encodeURI("data:text/csv;charset=utf-8,\uFEFF" + csvRows));
                 link.setAttribute("download", "employees_report.csv");
                 link.click();
               }} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                 <Download size={18} /> تصدير
               </button>
               <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                 <Plus size={18} /> إضافة موظف
               </button>
             </>
           )}
           {activeTab === 'tasks' && isAdminMode && (
             <button onClick={() => setShowTaskForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
               <Plus size={18} /> إضافة مهمة
             </button>
           )}
           {activeTab === 'trips' && isAdminMode && (
             <button onClick={() => setShowTripForm(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
               <Map size={18} /> تسجيل رحلة
             </button>
           )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
        {data && activeTab === 'fleet' && (
          <div className="overflow-auto max-h-[600px] border rounded-lg">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3">م</th>
                  <th className="p-3">نوع الشاحنة</th>
                  <th className="p-3">اللوحة</th>
                  <th className="p-3">تجديد الاستمارة</th>
                  <th className="p-3">الفحص الدوري</th>
                  <th className="p-3">الصيانة الدورية</th>
                  <th className="p-3">بطاقة التشغيل</th>
                  <th className="p-3">بطاقة السائق</th>
                  <th className="p-3">بطاقة أرامكو</th>
                  <th className="p-3 bg-blue-50">S/N الجهاز</th>
                  <th className="p-3 bg-blue-50">نوع التتبع</th>
                  <th className="p-3 bg-blue-50">حالة الجهاز</th>
                </tr>
              </thead>
              <tbody>
                {data.fleet.map((item, i) => {
                  const device = data.devices.find(d => d.plate === item.plate);
                  return (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-3">{item.id}</td>
                      <td className="p-3 font-semibold">{item.type}</td>
                      <td className="p-3 font-mono">{item.plate}</td>
                      <td className="p-3">{item.model}</td>
                      <td className="p-3 text-red-600 font-bold">{item.expiry}</td>
                      <td className="p-3 text-xs">{item.periodicInspection || '-'}</td>
                      <td className="p-3 text-xs">{item.periodicMaintenance || '-'}</td>
                      <td className="p-3 text-xs">{item.operatingCard || '-'}</td>
                      <td className="p-3 text-xs">{item.driverCard || '-'}</td>
                      <td className="p-3 text-xs">{item.aramcoCard || '-'}</td>
                      <td className="p-3 font-mono text-xs text-blue-600">{device?.sn || '-'}</td>
                      <td className="p-3 text-xs">{device?.type || '-'}</td>
                      <td className="p-3 text-xs">
                        {device ? (
                          <span className="text-green-600 font-bold">{device.status}</span>
                        ) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {data && activeTab === 'drivers' && (
          <div className="overflow-auto max-h-[600px] border rounded-lg">
            <table className="w-full text-right">
              <thead><tr className="bg-gray-50 border-b"><th className="p-3">م</th><th className="p-3">الاسم</th><th className="p-3">اللوحة</th><th className="p-3">رقم الجوال</th><th className="p-3">انتهاء الرخصة</th></tr></thead>
              <tbody>
                {data.drivers.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.id}</td>
                    <td className="p-3 font-bold">{item.name}</td>
                    <td className="p-3 font-mono">{item.plate}</td>
                    <td className="p-3" dir="ltr">{item.phone}</td>
                    <td className="p-3 text-red-600">{item.licenseExpiry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && activeTab === 'custody' && (
          <div className="overflow-auto max-h-[600px] border rounded-lg">
            <table className="w-full text-right">
              <thead><tr className="bg-gray-50 border-b"><th className="p-3">م</th><th className="p-3">السائق</th><th className="p-3">رقم الهوية</th><th className="p-3">نوع العهدة</th><th className="p-3">الحالة</th></tr></thead>
              <tbody>
                {data.custody.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.id}</td>
                    <td className="p-3 font-bold">{item.driverName}</td>
                    <td className="p-3">{item.idNumber}</td>
                    <td className="p-3">{item.type}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-[10px] bg-green-100 text-green-700 font-bold">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && activeTab === 'employees' && (
          <div className="overflow-auto max-h-[600px] border rounded-lg">
            <table className="w-full text-right">
              <thead><tr className="bg-gray-50 border-b"><th className="p-3">م</th><th className="p-3">اسم الموظف</th><th className="p-3">المهنة</th><th className="p-3">رقم الهوية</th><th className="p-3">تجديد الهوية</th><th className="p-3">تجديد الجواز</th><th className="p-3">التأمين الصحي</th><th className="p-3">تجديد الرخصة</th><th className="p-3">الحضور/الانصراف</th><th className="p-3">إجراءات</th></tr></thead>
              <tbody>
                {data.employees?.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{i+1}</td>
                    <td className="p-3 font-bold">{item.name}</td>
                    <td className="p-3 text-blue-600">{item.profession || '-'}</td>
                    <td className="p-3">{item.idNumber}</td>
                     <td className="p-3 text-xs">{item.license}</td>
                    <td className="p-3 text-[10px] font-mono" dir="ltr">{item.phone}</td>
                    <td className="p-3 font-medium text-orange-600">{item.idExpiry}</td>
                    <td className="p-3 text-xs">{item.passportExpiry || '-'}</td>
                    <td className="p-3 text-xs">{item.healthInsuranceExpiry || '-'}</td>
                    <td className="p-3">{item.licenseExpiry}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {(() => {
                          const today = new Date().toLocaleDateString('sv-SE');
                          const todayLog = (data?.attendance || []).find(a => a.employeeId === item.id && a.date === today);
                          const hasCheckedIn = !!todayLog;
                          const hasCheckedOut = !!todayLog?.checkOut;

                          return (
                            <>
                              <button 
                                disabled={hasCheckedIn}
                                onClick={() => {
                                  const now = new Date().toLocaleTimeString('sv-SE').slice(0, 5);
                                  const log = { id: Date.now(), employeeId: item.id, name: item.name, date: today, checkIn: now };
                                  const updated = [...(data?.attendance || []), log];
                                  setData({...data!, attendance: updated});
                                  localStorage.setItem('modern_carriers_attendance', JSON.stringify(updated));
                                  alert(`تم تسجيل حضور ${item.name} الساعة ${now}`);
                                }}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition ${hasCheckedIn ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                              >
                                {hasCheckedIn ? 'تم الحضور' : 'حضور'}
                              </button>
                              <button 
                                disabled={!hasCheckedIn || hasCheckedOut}
                                onClick={() => {
                                  const now = new Date().toLocaleTimeString('sv-SE').slice(0, 5);
                                  const lastIdx = (data?.attendance || []).reduce((acc: number, curr: AttendanceLog, idx: number) => 
                                    (curr.employeeId === item.id && curr.date === today) ? idx : acc, -1);
                                  
                                  if (lastIdx !== -1) {
                                    const updated = [...data!.attendance];
                                    updated[lastIdx] = { ...updated[lastIdx], checkOut: now };
                                    setData({...data!, attendance: updated});
                                    localStorage.setItem('modern_carriers_attendance', JSON.stringify(updated));
                                    alert(`تم تسجيل انصراف ${item.name} الساعة ${now}`);
                                  }
                                }}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition ${(!hasCheckedIn || hasCheckedOut) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
                              >
                                {hasCheckedOut ? 'تم الانصراف' : 'انصراف'}
                              </button>
                            </>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="p-3">
                      {isAdminMode ? (
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingItem(item); setIsEditing(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil size={16} /></button>
                          <button onClick={() => {
                            if (confirm('حذف الموظف؟')) {
                              const updated = data.employees.filter(e => e.id !== item.id);
                              setData({ ...data, employees: updated });
                              localStorage.setItem('modern_carriers_employees', JSON.stringify(updated));
                            }
                          }} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                        </div>
                      ) : (
                        <Lock size={14} className="text-gray-200" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && activeTab === 'tasks' && (
          <div className="overflow-auto max-h-[600px] border rounded-lg">
            <table className="w-full text-right">
              <thead><tr className="bg-gray-50 border-b"><th className="p-3">م</th><th className="p-3">المهمة</th><th className="p-3">المسؤول</th><th className="p-3">الحالة</th><th className="p-3">إجراءات</th></tr></thead>
              <tbody>
                {data.tasks?.map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-3">{i+1}</td>
                    <td className="p-3 font-bold">{item.title}</td>
                    <td className="p-3">{item.assignedTo}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {item.status === 'completed' ? 'مكتملة' : 'معلقة'}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      {isAdminMode && (
                        <>
                          <button onClick={() => {
                            const updated = data.tasks.map(t => t.id === item.id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } as TaskItem : t);
                            setData({ ...data, tasks: updated });
                            localStorage.setItem('modern_carriers_tasks', JSON.stringify(updated));
                          }} className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                            {item.status === 'completed' ? <Circle size={16} /> : <CheckCircle2 size={16} />}
                          </button>
                          <button onClick={() => {
                            if (confirm('حذف المهمة؟')) {
                              const updated = data.tasks.filter(t => t.id !== item.id);
                              setData({ ...data, tasks: updated });
                              localStorage.setItem('modern_carriers_tasks', JSON.stringify(updated));
                            }
                          }} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && activeTab === 'trips' && (
          <div className="overflow-auto max-h-[600px] border rounded-lg">
            <table className="w-full text-right">
              <thead><tr className="bg-gray-50 border-b"><th className="p-3">م</th><th className="p-3">الشاحنة</th><th className="p-3">السائق</th><th className="p-3">الوجهة</th><th className="p-3">الذهاب</th><th className="p-3">العودة</th><th className="p-3">الحالة</th><th className="p-3">إجراءات</th></tr></thead>
              <tbody>
                {data.trips?.map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-3">{i+1}</td>
                    <td className="p-3 font-bold">{item.truck}</td>
                    <td className="p-3">{item.driver}</td>
                    <td className="p-3">{item.destination}</td>
                    <td className="p-3 text-xs" dir="ltr">{item.departureDate}</td>
                    <td className="p-3 text-xs" dir="ltr">{item.returnDate || '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${item.status === 'returned' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                        {item.status === 'returned' ? 'عادت' : 'في الطريق'}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      {isAdminMode && (
                        <>
                          {item.status === 'travelling' && (
                            <button onClick={() => {
                              const now = new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' ');
                              const updated = data.trips.map(t => t.id === item.id ? { ...t, status: 'returned', returnDate: now } as TripItem : t);
                              setData({ ...data, trips: updated });
                              localStorage.setItem('modern_carriers_trips', JSON.stringify(updated));
                            }} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><CheckCircle2 size={16} /></button>
                          )}
                          <button onClick={() => {
                            if (confirm('حذف الرحلة؟')) {
                              const updated = data.trips.filter(t => t.id !== item.id);
                              setData({ ...data, trips: updated });
                              localStorage.setItem('modern_carriers_trips', JSON.stringify(updated));
                            }
                          }} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && activeTab === 'attendance' && (
          <div className="overflow-auto max-h-[600px] border rounded-lg">
            <table className="w-full text-right">
              <thead><tr className="bg-gray-50 border-b"><th className="p-3">التاريخ</th><th className="p-3">الاسم</th><th className="p-3">الحضور</th><th className="p-3">الانصراف</th><th className="p-3">إجراءات</th></tr></thead>
              <tbody>
                {data.attendance?.slice().reverse().map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-3 font-mono text-xs">{item.date}</td>
                    <td className="p-3 font-bold">{item.name}</td>
                    <td className="p-3 text-green-600 font-bold">{item.checkIn}</td>
                    <td className="p-3 text-red-600 font-bold">{item.checkOut || '-'}</td>
                    <td className="p-3">
                      {isAdminMode && (
                        <button onClick={() => {
                          if (confirm('حذف هذا السجل؟')) {
                            const updated = data.attendance.filter(a => a.id !== item.id);
                            setData({ ...data, attendance: updated });
                            localStorage.setItem('modern_carriers_attendance', JSON.stringify(updated));
                          }
                        }} className="text-red-600 p-1 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                <div className="text-[10px] text-blue-600 font-bold mb-1">الأسطول</div>
                <div className="text-xl font-black">{data.fleet.length}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                <div className="text-[10px] text-purple-600 font-bold mb-1">رحلات نشطة</div>
                <div className="text-xl font-black">{data.trips?.filter(t => t.status === 'travelling').length}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                <div className="text-[10px] text-green-600 font-bold mb-1">المهام المكتملة</div>
                <div className="text-xl font-black">{data.tasks?.filter(t => t.status === 'completed').length}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                <div className="text-[10px] text-orange-600 font-bold mb-1">الحضور اليوم</div>
                <div className="text-xl font-black">{data.attendance?.filter(a => a.date === new Date().toLocaleDateString('sv-SE')).length}</div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
                <div className="text-[10px] text-indigo-600 font-bold mb-1">إجمالي الرحلات</div>
                <div className="text-xl font-black">{data.trips?.length}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-bold mb-4 flex items-center gap-2"><ArrowRightLeft size={18} className="text-purple-600" /> تحليل الرحلات</h4>
                  <div className="flex justify-around items-end h-32">
                     <div className="text-center w-20">
                        <div className="bg-purple-500 w-12 mx-auto rounded-t" style={{ height: `${(data.trips?.filter(t => t.status === 'travelling').length || 1) * 20}px` }}></div>
                        <div className="text-[10px] mt-2">في الطريق</div>
                     </div>
                     <div className="text-center w-20">
                        <div className="bg-green-500 w-12 mx-auto rounded-t" style={{ height: `${(data.trips?.filter(t => t.status === 'returned').length || 1) * 20}px` }}></div>
                        <div className="text-[10px] mt-2">عادت</div>
                     </div>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-bold mb-4 flex items-center gap-2"><Users size={18} className="text-blue-600" /> أكثر السائقين حركة</h4>
                  <div className="space-y-4">
                    {Array.from(new Set(data.trips?.map(t => t.driver))).slice(0, 3).map((driver, i) => {
                      const count = data.trips?.filter(t => t.driver === driver).length || 0;
                      return (
                        <div key={i}>
                          <div className="flex justify-between text-[11px] mb-1"><span>{driver}</span><span>{count} رحلة</span></div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-600 h-full" style={{ width: `${(count / (data.trips?.length || 1)) * 100}%` }}></div></div>
                        </div>
                      );
                    })}
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* Fleet Modal */}
      {showFleetForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">إضافة شاحنة جديدة</h3>
              <button onClick={() => setShowFleetForm(false)}><X /></button>
            </div>
            <div className="space-y-4">
              <input placeholder="نوع الشاحنة" className="w-full p-2 border rounded" value={newFleet.type || ''} onChange={e => setNewFleet({...newFleet, type: e.target.value})} />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="رقم اللوحة" className="p-2 border rounded" value={newFleet.plate || ''} onChange={e => setNewFleet({...newFleet, plate: e.target.value})} />
                <input placeholder="الموديل (سنة)" type="number" className="p-2 border rounded" value={newFleet.model || ''} onChange={e => setNewFleet({...newFleet, model: parseInt(e.target.value)})} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="تجديد الاستمارة" className="p-2 border rounded" value={newFleet.expiry || ''} onChange={e => setNewFleet({...newFleet, expiry: e.target.value})} />
                <input placeholder="الفحص الدوري" className="p-2 border rounded" value={newFleet.periodicInspection || ''} onChange={e => setNewFleet({...newFleet, periodicInspection: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="الصيانة الدورية" className="p-2 border rounded" value={newFleet.periodicMaintenance || ''} onChange={e => setNewFleet({...newFleet, periodicMaintenance: e.target.value})} />
                <input placeholder="بطاقة التشغيل" className="p-2 border rounded" value={newFleet.operatingCard || ''} onChange={e => setNewFleet({...newFleet, operatingCard: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="بطاقة السائق" className="p-2 border rounded" value={newFleet.driverCard || ''} onChange={e => setNewFleet({...newFleet, driverCard: e.target.value})} />
                <input placeholder="بطاقة أرامكو" className="p-2 border rounded" value={newFleet.aramcoCard || ''} onChange={e => setNewFleet({...newFleet, aramcoCard: e.target.value})} />
              </div>
              <div className="border-t pt-4 mt-4">
                <p className="text-xs font-bold text-blue-600 mb-2">بيانات جهاز التتبع (اختياري)</p>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="S/N الجهاز" className="p-2 border rounded" value={newFleet.sn || ''} onChange={e => setNewFleet({...newFleet, sn: e.target.value})} />
                  <input placeholder="نوع التتبع" className="p-2 border rounded" value={newFleet.deviceType || ''} onChange={e => setNewFleet({...newFleet, deviceType: e.target.value})} />
                </div>
              </div>
              <button onClick={() => {
                const fleetItem = { 
                  id: Date.now(), 
                  type: newFleet.type, 
                  plate: newFleet.plate, 
                  model: newFleet.model, 
                  expiry: newFleet.expiry,
                  periodicInspection: newFleet.periodicInspection,
                  periodicMaintenance: newFleet.periodicMaintenance,
                  operatingCard: newFleet.operatingCard,
                  driverCard: newFleet.driverCard,
                  aramcoCard: newFleet.aramcoCard
                } as FleetItem;
                const updatedFleet = [...(data?.fleet || []), fleetItem];
                
                let updatedDevices = data?.devices || [];
                if (newFleet.sn) {
                  const deviceItem = { id: Date.now() + 1, plate: newFleet.plate, sn: newFleet.sn, type: newFleet.deviceType || 'GPS', status: 'فعال' } as DeviceItem;
                  updatedDevices = [...updatedDevices, deviceItem];
                }

                setData({...data!, fleet: updatedFleet, devices: updatedDevices});
                localStorage.setItem('modern_carriers_fleet', JSON.stringify(updatedFleet));
                localStorage.setItem('modern_carriers_devices', JSON.stringify(updatedDevices));
                setShowFleetForm(false);
                setNewFleet({});
              }} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold">حفظ البيانات</button>
            </div>
          </div>
        </div>
      )}



      {showTripForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">تسجيل رحلة جديدة</h3>
              <button onClick={() => setShowTripForm(false)}><X /></button>
            </div>
            <div className="space-y-4">
              <input placeholder="رقم الشاحنة" className="w-full p-2 border rounded" value={newTrip.truck || ''} onChange={e => setNewTrip({...newTrip, truck: e.target.value})} />
              <input placeholder="اسم السائق" className="w-full p-2 border rounded" value={newTrip.driver || ''} onChange={e => setNewTrip({...newTrip, driver: e.target.value})} />
              <input placeholder="الوجهة" className="w-full p-2 border rounded" value={newTrip.destination || ''} onChange={e => setNewTrip({...newTrip, destination: e.target.value})} />
              <input type="datetime-local" className="w-full p-2 border rounded" onChange={e => setNewTrip({...newTrip, departureDate: e.target.value.replace('T', ' ')})} />
              <button onClick={() => {
                const item = { ...newTrip, id: Date.now(), status: 'travelling' } as TripItem;
                const updated = [...(data?.trips || []), item];
                setData({...data!, trips: updated});
                localStorage.setItem('modern_carriers_trips', JSON.stringify(updated));
                setShowTripForm(false);
              }} className="w-full bg-purple-600 text-white p-3 rounded-xl font-bold">حفظ الرحلة</button>
            </div>
          </div>
        </div>
      )}

      {showTaskForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">إضافة مهمة جديدة</h3>
              <button onClick={() => setShowTaskForm(false)}><X /></button>
            </div>
            <div className="space-y-4">
              <input placeholder="عنوان المهمة" className="w-full p-2 border rounded" value={newTask.title || ''} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              <input placeholder="المسؤول" className="w-full p-2 border rounded" value={newTask.assignedTo || ''} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} />
              <input type="date" className="w-full p-2 border rounded" value={newTask.date || ''} onChange={e => setNewTask({...newTask, date: e.target.value})} />
              <button onClick={() => {
                const item = { ...newTask, id: Date.now(), status: 'pending' } as TaskItem;
                const updated = [...(data?.tasks || []), item];
                setData({...data!, tasks: updated});
                localStorage.setItem('modern_carriers_tasks', JSON.stringify(updated));
                setShowTaskForm(false);
              }} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold">حفظ المهمة</button>
            </div>
          </div>
        </div>
      )}

      {(showAddForm || isEditing) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{isEditing ? 'تعديل موظف' : 'إضافة موظف'}</h3>
              <button onClick={() => { setShowAddForm(false); setIsEditing(false); }}><X /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input className="col-span-2 p-2 border rounded" placeholder="الاسم" value={isEditing ? editingItem?.name : newEmployee.name} onChange={e => isEditing ? setEditingItem({...editingItem!, name: e.target.value}) : setNewEmployee({...newEmployee, name: e.target.value})} />
              <input className="col-span-2 p-2 border rounded" placeholder="المهنة (مثلاً: سائق، فني...)" value={isEditing ? editingItem?.profession : newEmployee.profession} onChange={e => isEditing ? setEditingItem({...editingItem!, profession: e.target.value}) : setNewEmployee({...newEmployee, profession: e.target.value})} />
              <input className="p-2 border rounded" placeholder="رقم الهوية" value={isEditing ? editingItem?.idNumber : newEmployee.idNumber} onChange={e => isEditing ? setEditingItem({...editingItem!, idNumber: parseInt(e.target.value)}) : setNewEmployee({...newEmployee, idNumber: parseInt(e.target.value)})} />
              <input className="p-2 border rounded" placeholder="تجديد الهوية" value={isEditing ? editingItem?.idExpiry : newEmployee.idExpiry} onChange={e => isEditing ? setEditingItem({...editingItem!, idExpiry: e.target.value}) : setNewEmployee({...newEmployee, idExpiry: e.target.value})} />
              <input className="p-2 border rounded" placeholder="الرخصة" value={isEditing ? editingItem?.license : newEmployee.license} onChange={e => isEditing ? setEditingItem({...editingItem!, license: e.target.value}) : setNewEmployee({...newEmployee, license: e.target.value})} />
              <input className="p-2 border rounded" placeholder="تجديد الرخصة" value={isEditing ? editingItem?.licenseExpiry : newEmployee.licenseExpiry} onChange={e => isEditing ? setEditingItem({...editingItem!, licenseExpiry: e.target.value}) : setNewEmployee({...newEmployee, licenseExpiry: e.target.value})} />
              <input className="p-2 border rounded" placeholder="تجديد الجواز" value={isEditing ? (editingItem?.passportExpiry || '') : (newEmployee.passportExpiry || '')} onChange={e => isEditing ? setEditingItem({...editingItem!, passportExpiry: e.target.value}) : setNewEmployee({...newEmployee, passportExpiry: e.target.value})} />
              <input className="p-2 border rounded" placeholder="التأمين الصحي" value={isEditing ? (editingItem?.healthInsuranceExpiry || '') : (newEmployee.healthInsuranceExpiry || '')} onChange={e => isEditing ? setEditingItem({...editingItem!, healthInsuranceExpiry: e.target.value}) : setNewEmployee({...newEmployee, healthInsuranceExpiry: e.target.value})} />
              <input className="p-2 border rounded col-span-2" placeholder="رقم الجوال" value={isEditing ? editingItem?.phone : newEmployee.phone} onChange={e => isEditing ? setEditingItem({...editingItem!, phone: e.target.value}) : setNewEmployee({...newEmployee, phone: e.target.value})} />
              <button onClick={() => {
                if (isEditing && editingItem) {
                  const updated = data?.employees.map(e => e.id === editingItem.id ? editingItem : e) || [];
                  setData({...data!, employees: updated});
                  localStorage.setItem('modern_carriers_employees', JSON.stringify(updated));
                  setIsEditing(false);
                } else {
                  const item = { ...newEmployee, id: Date.now() } as EmployeeItem;
                  const updated = [...(data?.employees || []), item];
                  setData({...data!, employees: updated});
                  localStorage.setItem('modern_carriers_employees', JSON.stringify(updated));
                  setShowAddForm(false);
                }
              }} className="col-span-2 bg-blue-600 text-white p-3 rounded-xl font-bold">حفظ الموظف</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-[10px] text-gray-400">
        نسخة v1.4.3 - إضافة أعمدة الجواز والتأمين الصحي للموظفين
      </div>
    </div>
  );
}
