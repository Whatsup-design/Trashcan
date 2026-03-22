// components/layout/AppHeader.tsx

import Logout      from "./Logout/Logout";
import styles      from "./AppHeader.module.css";
import Bell        from "./Bells/bell";
import Searchbar   from "./Search/Searchbar";

export default function AppHeader() {
  return (
    <header className={styles.header}>

      <div className={styles.headerLeft}>
        <span className={styles.pageTitle}>Admin Dashboard</span>
      </div>

      <div className={styles.headerRight}>
        <Searchbar />
        <Bell />
        
        <Logout />
      </div>

    </header>
  );
}