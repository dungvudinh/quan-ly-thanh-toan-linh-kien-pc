import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../../../redux/actions/themeActions";
import { setActiveTab } from "../../../redux/actions/tabActions";
import logo from '../../../assets/images/logo.png'
import {
  Moon,
  Sun,
} from "lucide-react";
import { Link } from "react-router-dom";

function Index({navItems}) {
    const dispatch = useDispatch();
    const {theme} = useSelector(state=>state.theme)
    const {activeTab} = useSelector(state=>state.tab)
    const handleChangeTab = (tabKey) => {
        dispatch(setActiveTab(tabKey));
    }
  return (
    <aside className={`flex h-screen w-64 flex-col justify-between border-r border-neutral-100  ${theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-100'} px-4 py-6`}>
      <div>
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-12 w-12">
            <img src={logo} alt="Logo" className="h-full w-full object-contain" />
          </div>
          <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
            Lac Viet Studio
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                to={`/${item.key}`}
                key={item.key}
                onClick={() => handleChangeTab(item.key)}
                className={`group relative cursor-pointer flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeTab === item.key
                    ? `shadow-sm ${theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'}`
                    : `${theme === 'dark' ? 'text-white hover:bg-white hover:text-neutral-900' : 'text-neutral-500 hover:bg-neutral-900 hover:text-white'}`
                }`}
              >
                
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                    activeTab === item.key ? "" : "group-hover:scale-110"
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {activeTab === item.key && (
                  <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom utilities */}
      <div className="flex flex-col gap-y-2 rounded-full  w-10 items-center justify-center p-2 bg-white">
        <button onClick={()=>dispatch(setTheme('dark'))} className={`cursor-pointer w-full flex items-center justify-center rounded-full ${theme === 'dark' ? 'bg-neutral-100' : ''}`}>
            <Moon className={`w-4 text-neutral-400 rounded-full ${theme === 'dark' ? 'text-neutral-700' : ''}`}/>
        </button>
        <button onClick={()=>dispatch(setTheme('light'))} className={`cursor-pointer w-full flex items-center justify-center rounded-full ${theme === 'light' ? 'bg-neutral-100' : ''}`}>
            <Sun className={`w-4 text-neutral-400 rounded-full ${theme === 'light' ? 'text-neutral-700' : ''}`} />
        </button>
      </div>
    </aside>
  );
}

export default Index;