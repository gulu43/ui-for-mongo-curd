import { Outlet } from 'react-router-dom';

// project-imports
// import Breadcrumbs from '../../components/Breadcrumbs.jsx';
import Drawer from './Drawer';
import Footer from './Footer';
import Header from './Header';
// import NavigationScroll from '../../components/NavigationScroll.jsx';

// ==============================|| MAIN LAYOUT ||============================== //

export default function MainLayout({ page }) {
  return (
    <div>
      <Drawer />
      <Header />
      <div className="pc-container">
        <div className="pc-content">
          {/* <Breadcrumbs /> */}
          {/* <div>ok it is rendering</div> */}
          {/* <NavigationScroll> */}
          {/* <Outlet /> */}
          {page}
          {/* </NavigationScroll> */}
        </div>
      </div>
      <Footer />
    </div>
  );
}
