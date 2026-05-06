import { aboutData } from "@/lib/mockData/user/About";
import HardwareSlider from "@/components/RouterUser/About/HardwareSlider";
import PeoplePreview from "@/components/RouterUser/About/PeoplePreview";
import styles from "./page.module.css";

export default function AboutPage() {
  const { project, hardwareSlides } = aboutData;

  return (
    <div className={styles.page}>
      <section className={styles.hardwareSection}>
        <div className={styles.sliderWrap}>
          <HardwareSlider slides={hardwareSlides} />
        </div>

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
      <PeoplePreview />
    </div>
  );
}
