import { useState, useEffect } from 'react';
import { Truck, Navigation, FileText, Users, ExternalLink, Loader2, Lock, ClipboardList, Plus, Pencil, Trash2, Save, X, Download, BarChart2, Clock, DollarSign, CheckCircle2, Circle, ListTodo } from 'lucide-react';

interface FleetItem { id: number; type: string; plate: string; model: number; expiry: string; }
interface CustodyItem { id: number; driverName: string; idNumber: number; type: string; status: string; }
interface DeviceItem { id: number; type: string; truck: string; serial?: string; status: string; }
interface DriverItem { id: number; name: string; plate: string; licenseExpiry: string; phone: number; }
interface EmployeeItem { id: number; name: string; idNumber: number; license: string; phone: string; idExpiry: string; licenseExpiry: string; }
interface TaskItem { id: number; title: string; assignedTo: string; status: 'completed' | 'pending' | 'in-progress'; date: string; }

export default function ModernCarriersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('modern_carriers_auth') === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [data, setData] = useState<{
    fleet: FleetItem[];
    custody: CustodyItem[];
    devices: DeviceItem[];
    drivers: DriverItem[];
    employees: EmployeeItem[];
    tasks: TaskItem[];
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('fleet');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<EmployeeItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Partial<EmployeeItem>>({});
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState<Partial<TaskItem>>({ status: 'pending' });

  useEffect(() => {
    fetch('/data/nwagl.json')
      .then(res => res.json())
      .then(json => {
        // Load from localStorage if available, otherwise use json
        const savedEmployees = localStorage.getItem('modern_carriers_employees');
        if (savedEmployees) {
          json.employees = JSON.parse(savedEmployees);
        }
        const savedTasks = localStorage.getItem('modern_carriers_tasks');
        if (savedTasks) {
          json.tasks = JSON.parse(savedTasks);
        } else if (!json.tasks) {
          json.tasks = [
            { id: 1, title: 'فحص زيت الشاحنات الأسبوعي', assignedTo: 'أحمد الفكي', status: 'completed', date: '2026-05-01' },
            { id: 2, title: 'تجديد استمارة شاحنة 9849', assignedTo: 'إدارة', status: 'pending', date: '2026-05-10' },
            { id: 3, title: 'تركيب أجهزة تتبع جديدة', assignedTo: 'فني التقنية', status: 'in-progress', date: '2026-05-08' }
          ];
        }
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
        <button 
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition ${activeTab === 'employees' ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <ClipboardList size={18} /> نموذج بيانات ومتابعة الموظفين
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition ${activeTab === 'tasks' ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <ListTodo size={18} /> المهام التشغيلية
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition ${activeTab === 'reports' ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <BarChart2 size={18} /> التقارير والتحليلات
        </button>
      </div>

      {/* Export Utility Function */}
      {(() => {
        const exportToCSV = (tableData: any[], fileName: string) => {
          if (!tableData || tableData.length === 0) return;
          const headers = Object.keys(tableData[0]).join(',');
          const rows = tableData.map(obj => Object.values(obj).join(',')).join('\n');
          const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers + '\n' + rows;
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `${fileName}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        return null;
      })()}

      {/* Action Bar for Employees */}
      {activeTab === 'employees' && (
        <div className="mb-4 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">إدارة سجل الموظفين</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                const tableData = data?.employees || [];
                const headers = ["ID", "Name", "ID Number", "License", "Phone", "ID Expiry", "License Expiry"];
                const csvRows = [
                  headers.join(','),
                  ...tableData.map(e => [e.id, `"${e.name}"`, e.idNumber, `"${e.license}"`, e.phone, e.idExpiry, e.licenseExpiry].join(','))
                ].join('\n');
                const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows;
                const link = document.createElement("a");
                link.setAttribute("href", encodeURI(csvContent));
                link.setAttribute("download", "employees_report.csv");
                link.click();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <Download size={18} /> تصدير CSV
            </button>
            <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus size={18} /> إضافة موظف جديد
            </button>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="mb-4 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">سجل المهام اليومية</h3>
          <button 
            onClick={() => setShowTaskForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} /> إضافة مهمة جديدة
          </button>
        </div>
      )}

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

        {data && activeTab === 'employees' && (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3">م</th>
                  <th className="p-3">اسم الموظف</th>
                  <th className="p-3">رقم الهوية</th>
                  <th className="p-3">الرخصة</th>
                  <th className="p-3">رقم الجوال</th>
                  <th className="p-3">انتهاء الهوية</th>
                  <th className="p-3">تاريخ انتهاء الرخصة</th>
                  <th className="p-3">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {data.employees?.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.id}</td>
                    <td className="p-3 font-semibold">{item.name}</td>
                    <td className="p-3 text-gray-600">{item.idNumber || '-'}</td>
                    <td className="p-3 text-gray-600">{item.license || '-'}</td>
                    <td className="p-3 text-blue-600" dir="ltr" style={{ textAlign: 'right' }}>{item.phone || '-'}</td>
                    <td className="p-3 text-gray-600">{item.idExpiry || '-'}</td>
                    <td className="p-3 text-gray-600">{item.licenseExpiry || '-'}</td>
                    <td className="p-3 flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingItem(item);
                          setIsEditing(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="تعديل"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
                            const updated = data.employees.filter(e => e.id !== item.id);
                            const newData = { ...data, employees: updated };
                            setData(newData);
                            localStorage.setItem('modern_carriers_employees', JSON.stringify(updated));
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && activeTab === 'tasks' && (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3">م</th>
                  <th className="p-3">المهمة</th>
                  <th className="p-3">المسؤول</th>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {data.tasks?.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.id}</td>
                    <td className="p-3 font-semibold">{item.title}</td>
                    <td className="p-3 text-gray-600">{item.assignedTo}</td>
                    <td className="p-3 text-gray-500">{item.date}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'completed' ? 'bg-green-100 text-green-700' :
                        item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {item.status === 'completed' ? 'مكتملة' : item.status === 'in-progress' ? 'قيد التنفيذ' : 'معلقة'}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button 
                        onClick={() => {
                          const updated = data.tasks.map(t => t.id === item.id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } as TaskItem : t);
                          setData({ ...data, tasks: updated });
                          localStorage.setItem('modern_carriers_tasks', JSON.stringify(updated));
                        }}
                        className={`p-1.5 rounded ${item.status === 'completed' ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                      >
                        {item.status === 'completed' ? <Circle size={16} /> : <CheckCircle2 size={16} />}
                      </button>
                      <button 
                         onClick={() => {
                          if (confirm('حذف المهمة؟')) {
                            const updated = data.tasks.filter(t => t.id !== item.id);
                            setData({ ...data, tasks: updated });
                            localStorage.setItem('modern_carriers_tasks', JSON.stringify(updated));
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Existing stats... */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="text-xs text-blue-600 mb-1 font-bold">إجمالي الأسطول</div>
                <div className="text-2xl font-black text-blue-900">{data.fleet.length}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <div className="text-xs text-green-600 mb-1 font-bold">الموظفين</div>
                <div className="text-2xl font-black text-green-900">{data.employees?.length || 0}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <div className="text-xs text-orange-600 mb-1 font-bold">مهام منجزة</div>
                <div className="text-2xl font-black text-orange-900">{data.tasks?.filter(t => t.status === 'completed').length || 0}</div>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <div className="text-xs text-red-600 mb-1 font-bold">مهام متبقية</div>
                <div className="text-2xl font-black text-red-900">{data.tasks?.filter(t => t.status !== 'completed').length || 0}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="border rounded-xl p-6 bg-white shadow-sm">
                  <h4 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
                    <CheckCircle2 size={18} className="text-green-500" />
                    تقرير إنجاز المهام (Task Completion)
                  </h4>
                  <div className="relative h-48 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-black text-gray-900">
                          {Math.round(((data.tasks?.filter(t => t.status === 'completed').length || 0) / (data.tasks?.length || 1)) * 100)}%
                        </div>
                        <div className="text-sm text-gray-500">نسبة الإنجاز الكلية</div>
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-center">
                    <div className="p-2 bg-green-50 rounded text-green-700">مكتملة: {data.tasks?.filter(t => t.status === 'completed').length}</div>
                    <div className="p-2 bg-red-50 rounded text-red-700">متبقية: {data.tasks?.filter(t => t.status !== 'completed').length}</div>
                  </div>
               </div>
               
               <div className="border rounded-xl p-6 bg-white shadow-sm">
                  <h4 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
                    <Clock size={18} className="text-blue-500" />
                    وقت التشغيل الفعلي (Fleet Uptime)
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>الأسطول النشط</span>
                        <span>92%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[92%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>أجهزة التتبع الفعالة</span>
                        <span>100%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[100%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>معدل الصيانة</span>
                        <span>8%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full w-[8%]"></div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
              <h4 className="font-bold mb-2">توصيات النظام (AI Insights)</h4>
              <p className="text-sm text-gray-600">
                بناءً على المهام الحالية، يوجد تأخير في "تجديد استمارة شاحنة 9849". ننصح بتكليف مسؤول إضافي لإنهاء المهام المعلقة لزيادة كفاءة الأسطول.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tasks Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">إضافة مهمة جديدة</h3>
              <button onClick={() => setShowTaskForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان المهمة</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newTask.title || ''}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="مثلاً: فحص الإطارات..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المسؤول</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newTask.assignedTo || ''}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  placeholder="اسم الموظف أو القسم"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الاستحقاق</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newTask.date || ''}
                  onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t flex gap-3">
              <button 
                onClick={() => {
                  const id = (data?.tasks.length || 0) + 1;
                  const item = { ...newTask, id, status: 'pending' } as TaskItem;
                  const updated = [...(data?.tasks || []), item];
                  setData({...data!, tasks: updated});
                  localStorage.setItem('modern_carriers_tasks', JSON.stringify(updated));
                  setShowTaskForm(false);
                  setNewTask({ status: 'pending' });
                }}
                className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition"
              >
                إضافة المهمة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddForm || isEditing) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">
                {isEditing ? 'تعديل بيانات موظف' : 'إضافة موظف جديد'}
              </h3>
              <button onClick={() => { setShowAddForm(false); setIsEditing(false); setEditingItem(null); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم الموظف</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={isEditing ? editingItem?.name : newEmployee.name}
                  onChange={(e) => isEditing ? setEditingItem({...editingItem!, name: e.target.value}) : setNewEmployee({...newEmployee, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهوية</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={isEditing ? editingItem?.idNumber : newEmployee.idNumber}
                  onChange={(e) => isEditing ? setEditingItem({...editingItem!, idNumber: parseInt(e.target.value)}) : setNewEmployee({...newEmployee, idNumber: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الرخصة</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={isEditing ? editingItem?.license : newEmployee.license}
                  onChange={(e) => isEditing ? setEditingItem({...editingItem!, license: e.target.value}) : setNewEmployee({...newEmployee, license: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={isEditing ? editingItem?.phone : newEmployee.phone}
                  onChange={(e) => isEditing ? setEditingItem({...editingItem!, phone: e.target.value}) : setNewEmployee({...newEmployee, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">انتهاء الهوية</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={isEditing ? editingItem?.idExpiry : newEmployee.idExpiry}
                  onChange={(e) => isEditing ? setEditingItem({...editingItem!, idExpiry: e.target.value}) : setNewEmployee({...newEmployee, idExpiry: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ انتهاء الرخصة</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={isEditing ? editingItem?.licenseExpiry : newEmployee.licenseExpiry}
                  onChange={(e) => isEditing ? setEditingItem({...editingItem!, licenseExpiry: e.target.value}) : setNewEmployee({...newEmployee, licenseExpiry: e.target.value})}
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t flex gap-3">
              <button 
                onClick={() => {
                  if (isEditing && editingItem) {
                    const updated = data?.employees.map(e => e.id === editingItem.id ? editingItem : e) || [];
                    setData({...data!, employees: updated});
                    localStorage.setItem('modern_carriers_employees', JSON.stringify(updated));
                    setIsEditing(false);
                    setEditingItem(null);
                  } else {
                    const id = (data?.employees.length || 0) + 1;
                    const item = { ...newEmployee, id } as EmployeeItem;
                    const updated = [...(data?.employees || []), item];
                    setData({...data!, employees: updated});
                    localStorage.setItem('modern_carriers_employees', JSON.stringify(updated));
                    setShowAddForm(false);
                    setNewEmployee({});
                  }
                }}
                className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Save size={18} /> حفظ البيانات
              </button>
              <button 
                onClick={() => { setShowAddForm(false); setIsEditing(false); setEditingItem(null); }}
                className="flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-2 rounded-lg hover:bg-gray-50 transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
