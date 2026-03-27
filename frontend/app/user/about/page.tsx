// app/user/about/page.tsx
import { aboutData }   from "@/lib/mockData/user/About";
import HardwareSlider  from "@/components/RouterUser/About/HardwareSlider";
import PersonGroup     from "@/components/RouterUser/About/PersonGroup";
import styles          from "./page.module.css";

export default function AboutPage() {
  const { project, hardwareSlides, people } = aboutData;

  return (
    <div className={styles.page}>

      {/* ── Hardware section ──────────────────────────── */}
      <section className={styles.hardwareSection}>
        {/* Slider */}
        <div className={styles.sliderWrap}>
          <HardwareSlider slides={hardwareSlides} />
        </div>

        {/* Description */}
        <div className={styles.descWrap}>
          <p className={styles.descLine}>
            <span className={styles.bold}>ชื่อโครงการ</span> : {project.name}
          </p>
          <p className={styles.descLine}>
            <span className={styles.bold}>จุดประสงค์</span> : {project.objective}
          </p>
          <p className={styles.descLine}>
            <span className={styles.bold}>กลุ่มการเรียนรู้</span> : {project.studyGroup}
          </p>
          <p className={styles.descLine}>
            <span className={styles.bold}>หมวดหมู่โครงงาน</span> : {project.projectGroup}
          </p>
          <p className={styles.descBody}>{project.description}</p>
        </div>
      </section>

      {/* ── People sections ───────────────────────────── */}
      <section className={styles.peopleSection}>
        <PersonGroup group="manager"   people={people} />
        <PersonGroup group="advisor"   people={people} />
        <PersonGroup group="developer" people={people} />
      </section>
    
     

    </div>
  );
}