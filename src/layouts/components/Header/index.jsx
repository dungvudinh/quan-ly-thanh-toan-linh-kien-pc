import { Search, Bell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
function Header({navItems}) {
    console.log(navItems)
    const dispatch = useDispatch();
    const {activeTab} = useSelector(state=>state.tab)
    const {theme} = useSelector(state=>state.theme)
    const title = navItems.find(item => item.key === activeTab)?.label.toUpperCase() || '';
    const userName = "Nguyen Van A";
    const avatarUrl = null; // Replace with the actual avatar URL if available
  return (
    <header className="flex items-center justify-between gap-4  bg-neutral-100 px-8 py-5">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
        {title}
      </h1>

      <div className="flex flex-1 items-center justify-end gap-3">
        {/* Search */}
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-700 outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white focus:ring-4 focus:ring-neutral-100"
          />
        </div>

        {/* Create button */}
        {/* <button className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-800 active:scale-95">
          <Plus className="h-4 w-4" />
          Tạo mới
        </button> */}

        {/* Notification */}
        <button className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors duration-200 hover:bg-neutral-50">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        {/* Chat */}
        {/* <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors duration-200 hover:bg-neutral-50">
          <MessageCircle className="h-[18px] w-[18px]" />
        </button> */}

        {/* Avatar */}
        <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1 transition-colors duration-200 hover:bg-neutral-100">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-600">
              {userName.slice(0, 2).toUpperCase()}
            </div>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;