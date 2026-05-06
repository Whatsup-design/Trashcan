import { aboutData } from "@/lib/mockData/user/About";
import HardwareSlider from "@/components/RouterUser/About/HardwareSlider";
import PeoplePreview, {
  type PersonPreviewItem,
} from "@/components/RouterUser/About/PeoplePreview";
import styles from "./page.module.css";

const gen15People: PersonPreviewItem[] = [
  {
    id: "1",
    name: "Sun",
    image: "/AboutPic/Gen15/Sun.png",
    alt: "Sun portrait",
  },
  {
    id: "2",
    name: "Sonson",
    image: "/AboutPic/Gen15/Sonson.png",
    alt: "Sonson portrait",
  },
  {
    id: "3",
    name: "Idea",
    image: "/AboutPic/Gen15/Idea.png",
    alt: "Idea portrait",
  },
  {
    id: "4",
    name: "Punpun",
    image: "/AboutPic/Gen15/Punpun.png",
    alt: "Punpun portrait",
  },
  {
    id: "5",
    name: "Maprang",
    image: "/AboutPic/Gen15/Maprang.png",
    alt: "Maprang portrait",
  },
  {
    id: "6",
    name: "Sita",
    image: "/AboutPic/Gen15/Sita.png",
    alt: "Sita portrait",
  },
  {
    id: "7",
    name: "Boss",
    image: "/AboutPic/Gen15/Boss.png",
    alt: "Boss portrait",
  },
];

const gen16People: PersonPreviewItem[] = [
  {
    id: "1",
    name: "GG",
    image: "/AboutPic/Gen16/gg.png",
    alt: "GG portrait",
  },
  {
    id: "2",
    name: "Issac",
    image: "/AboutPic/Gen16/issac.png",
    alt: "Issac portrait",
  },
  {
    id: "3",
    name: "Kanomjean",
    image: "/AboutPic/Gen16/kanomjean.png",
    alt: "Kanomjean portrait",
  },
  {
    id: "4",
    name: "Pakthan",
    image: "/AboutPic/Gen16/pakthan.png",
    alt: "Pakthan portrait",
  },
  {
    id: "5",
    name: "Taj",
    image: "/AboutPic/Gen16/taj.png",
    alt: "Taj portrait",
  },
];

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
      <div className={styles.generations}>
        <PeoplePreview title="GEN15" people={gen15People} desktopColumns={4} />
        <PeoplePreview title="GEN16" people={gen16People} desktopColumns={3} desktopGap={5} />
      </div>
    </div>
  );
}
