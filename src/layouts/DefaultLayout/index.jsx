import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Receipt, Briefcase, Tag, Search } from "lucide-react";
const NAV_ITEMS = [
  { key: "client-invoice",label: "Hóa đơn khách hàng", icon: Receipt },
  { key: "freelancer-invoice", label: "Hóa đơn freelancer", icon: Briefcase },
  { key: "pricing" ,label: "Bảng giá", icon: Tag },
  { key: "lookup", label: "Tra cứu model", icon: Search },
];
function DefaultLayout({ children }) {
  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar navItems={NAV_ITEMS} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header navItems={NAV_ITEMS} />

        <main className="flex-1 overflow-y-auto bg-neutral-100">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DefaultLayout;