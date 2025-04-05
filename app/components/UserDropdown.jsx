import { LogOut, Wallet } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import useSidebar from "../store/sidebar";
import useMediaQuery from "../store/useMediaQuery";

function UserDropdown() {
  const router = useRouter();
  const { sideBar, setSideBar, setSmSidebar, setShowLogoutModal } =
    useSidebar();
  const { isMobile } = useMediaQuery();

  const handleToggleSidebar = () => {
    isMobile ? setSmSidebar(false) : setSideBar(!sideBar);
  };

  const options = [
    {
      name: "Subscription",
      icon: Wallet,
      path: "/pricing",
    },
    {
      name: "Sign Out",
      icon: LogOut,
    },
  ];

  const OnOptionClick = (option) => {
    if (option.name === "Sign Out") {
      setShowLogoutModal(true);
      return;
    }

    if (option?.path) {
      handleToggleSidebar();
      router.push(option?.path);
    }
  };

  return (
    <div className="p-2 w-full px-3">
      <div className="">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => OnOptionClick(option)}
            className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-slate-100 transition-colors
            ${index === 0 ? "rounded-t-lg" : "rounded-none"} 
            ${index === options.length - 1 ? "rounded-b-lg" : ""}`}
          >
            <option.icon size={18} />
            <span>{option.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default UserDropdown;
