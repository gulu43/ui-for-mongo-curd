import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
// react-bootstrap
import Image from 'react-bootstrap/Image';

// third-party

// project-imports
import DrawerContent from './DrawerContent';
import { handlerDrawerOpen, useGetMenuMaster } from '../../../api/menu.js';

// assets
import logo from '../../../assets/images/logo-dark.svg';

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

export default function MainDrawer() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;
  const [selectedItems, setSelectedItems] = useState();
  const [role, setRole] = useState(localStorage.getItem('role'))
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current?.contains(event.target)) {
        handlerDrawerOpen(false);
      }
    };
    if (isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  return (
    <nav id="pc-sidebar" className={`pc-sidebar ${drawerOpen ? 'pc-sidebar-hide mob-sidebar-active' : ''} `}>
      <div className="navbar-wrapper">
        <div className="m-header">
          <a className="b-brand text-primary">
            <Image src={logo} fluid className="logo logo-lg" alt="logo" style={{ height: '35px', marginRight: '10px' }} /> <span>Companey Heading</span>
          </a>
        </div>
        <div>

        </div>
        {/* <div className="navbar-content">
          <DrawerContent selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
        </div> */}


        <div className="navbar-content">
          <ul className="pc-navbar">

            {/* ---------- Dashboard Heading ---------- */}
            <li className="pc-item pc-caption">
              <label>All Pages</label>
            </li>

            <li className="pc-item">
              <Link className="pc-link" to="/home">
                <span className="pc-micon"><i className="ph-duotone ph-house"></i></span>
                Home
              </Link>
            </li>

            {/* <li className="pc-item">
              <Link className="pc-link" to="/updatepassword">
                <span className="pc-micon"><i className="ph-duotone ph-chart-bar"></i></span>
                UpdatePassword
              </Link>
            </li> */}

            {/* ---------- Pages Heading ----------
            <li className="pc-item pc-caption">
              <label>Pages</label>
            </li> */}
            {role.includes(['admin']) && <li className="pc-item">
              <Link className="pc-link" to="/getuser">
                <span className="pc-micon"><i className="ph-duotone ph-users"></i></span>
                Users
              </Link>
            </li>}


            {/* <li className="pc-item">
              <Link className="pc-link" to="/products">
                <span className="pc-micon"><i className="ph-duotone ph-bag"></i></span>
                Products
              </Link>
            </li>

            <li className="pc-item">
              <Link className="pc-link" to="/profile">
                <span className="pc-micon"><i className="ph-duotone ph-user-circle"></i></span>
                Profile
              </Link>
            </li> */}

            {/* <li className="pc-item">
              <Link className="pc-link" to="/logout">
                <span className="pc-micon"><i className="ph-duotone ph-sign-out"></i></span>
                Logout
              </Link>
            </li> */}

          </ul>
        </div>


      </div>
      {drawerOpen && isMobile && <div className="pc-menu-overlay" ref={overlayRef} />}
    </nav>
  );
}
