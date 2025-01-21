import { useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from './ui/Sidebar';
import HistoryList from './History/HistoryList'
import { Dashboard } from './Dashboard';
import { Link } from 'react-router-dom';
import HistoryInsights from './History/HistoryInsights';
import { motion } from 'framer-motion';
import { links } from '@/data';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLogoutMutation } from '@/features/apiSlice';
import { useDispatch } from 'react-redux';
import { setToken, setUserId } from '@/features/authSlice';
import UserProfile from './UserProfile';
import AccountSettings from './AccountSettings';
 
 
export function SidebarDemo() {
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const [activeContent, setActiveContent] = useState('Profile');
  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      dispatch(setUserId(null));
      dispatch(setToken(null));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err?.message);
      } else toast.error('Unexpected error occured');
    }
  };
  const handleLinkClick = (label: string) => {
    setActiveContent(label);
    console.log(label)
    if (label === 'Logout') {
      handleLogout();
    }
  };
  return (
    <div
      className={
        'rounded-md flex flex-col md:flex-row bg-black-100 w-full h-screen flex-1 mx-auto border border-neutral-200 overflow-hidden'
      }
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  activeContent={activeContent}
                  onClick={() => handleLinkClick(link.label)}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: 'Manu Arora',
                href: '#',
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full z-10"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {activeContent === 'Profile' && <UserProfile />}
      {activeContent === 'Interviews' && <Dashboard />}
<<<<<<< HEAD
<<<<<<< HEAD
      {activeContent === 'Settings' && <AccountSettings></AccountSettings>}
      
      
=======
      {activeContent === 'History' && <HistoryList />}
      {activeContent === 'HistoryInsights' && <HistoryInsights />}

>>>>>>> 73e4caec873884d9cdf3a010259522cfd753d90f
=======
      {activeContent === 'Settings' && <AccountSettings></AccountSettings>}
      {activeContent === 'History' && <HistoryList />}
      {activeContent === 'HistoryInsights' && <HistoryInsights />}
>>>>>>> 5dfe719611acd4b6f7f483844a1c66e206a082ec
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-white whitespace-pre"
      >
        SmartPrep
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
