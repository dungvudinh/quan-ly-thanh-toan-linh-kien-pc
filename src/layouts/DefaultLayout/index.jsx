import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Receipt, Briefcase, Tag, Search } from "lucide-react";
import { useSelector } from 'react-redux';
const NAV_ITEMS = [
  { key: "client-invoices",label: "Hóa đơn khách hàng", icon: Receipt },
  { key: "freelancer-invoices", label: "Hóa đơn freelancer", icon: Briefcase },
  { key: "pricing" ,label: "Bảng giá", icon: Tag },
  { key: "lookup", label: "Tra cứu model", icon: Search },
];
function DefaultLayout({ children }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-neutral-900 text-gray-100' : 'bg-neutral-50 text-neutral-900'}`}>
      <Sidebar navItems={NAV_ITEMS} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header navItems={NAV_ITEMS} />

        <main className={`flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default DefaultLayout;
