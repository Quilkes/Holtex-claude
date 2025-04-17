import { LogOut, Wallet } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useSidebar from "../store/sidebar";
import useMediaQuery from "../store/useMediaQuery";

function UserDropdown() {
  const router = useRouter();
  const {
    sideBar,
    openUserDropDown,
    setSideBar,
    setSmSidebar,
    setShowLogoutModal,
  } = useSidebar();
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
    <AnimatePresence>
      {openUserDropDown && (
        <motion.div
          className="p-2 w-full px-3 absolute bottom-16 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => OnOptionClick(option)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors text-gray-700
                ${index !== options.length - 1 ? "border-b border-gray-100" : ""}`}
                whileHover={{ backgroundColor: "#f8fafc" }}
                whileTap={{ scale: 0.98 }}
              >
                <option.icon size={18} className="text-[#800080]" />
                <span className="font-medium">{option.name}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UserDropdown;
