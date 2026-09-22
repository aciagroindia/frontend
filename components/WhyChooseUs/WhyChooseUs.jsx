import Image from "next/image";
import styles from "./WhyChooseUs.module.css";

const DEFAULT_DATA = {
  tag: "ROOTED IN TRADITION",
  mainHeading: "WHY CHOOSE US",
  heading: "Crafted by Nature.",
  subheading: "Powered by ACI.",
  description:
    "ACI me hum ancient Ayurvedic wisdom ko modern science ke saath combine karke aise products banate hain jo aapke body ko naturally nourish kare. Har ingredient carefully source kiya jata hai, ethically process hota hai, aur proper testing ke baad hi use hota hai — taaki aapko mile pure, natural aur trusted wellness.",
  points: [
    {
      title: "✔ 100% Natural",
      description: "No artificial additives or preservatives.",
    },
    {
      title: "✔ Ethically Sourced",
      description: "Direct partnerships with trusted farmers.",
    },
    {
      title: "✔ Lab Tested",
      description: "Strict quality control for every batch.",
    },
  ],
  imageUrl: "/certifiedIcons/whychooseus.png",
  isActive: true,
};

const getCloudinaryUrl = (src, width = 800, quality = "auto") => {
  if (!src || !src.includes("res.cloudinary.com")) return src;
  const params = `f_auto,q_${quality},w_${width},c_limit`;
  return src.replace("/upload/", `/upload/${params}/`);
};

export default function WhyChooseUs({ initialData = null }) {
  const data = initialData || DEFAULT_DATA;

  if (data.isActive === false) {
    return null;
  }

  const rawSrc = data.imageUrl || "/certifiedIcons/whychooseus.png";
  const isCloudinary = typeof rawSrc === "string" && rawSrc.includes("res.cloudinary.com");
  const optimizedSrc = isCloudinary ? getCloudinaryUrl(rawSrc, 800) : rawSrc;

  return (
    <section className={styles.section} id="why-choose-us">
      <h2 className={styles.mainHeading}>{data.mainHeading || "WHY CHOOSE US"}</h2>

      <div className={styles.container}>
        {/* LEFT CONTENT */}
        <div className={styles.content}>
          <span className={styles.tag}>{data.tag || "ROOTED IN TRADITION"}</span>

          <h2 className={styles.heading}>
            {data.heading || "Crafted by Nature."}{" "}
            {data.subheading && (
              <>
                <br />
                <span>{data.subheading}</span>
              </>
            )}
          </h2>

          <p className={styles.description}>{data.description}</p>

          <div className={styles.points}>
            {data.points && data.points.length > 0 ? (
              data.points.map((point, index) => (
                <div key={index} className={styles.pointItem}>
                  <strong className={styles.pointTitle}>{point.title}</strong>
                  <p className={styles.pointDesc}>{point.description}</p>
                </div>
              ))
            ) : (
              DEFAULT_DATA.points.map((point, index) => (
                <div key={index} className={styles.pointItem}>
                  <strong className={styles.pointTitle}>{point.title}</strong>
                  <p className={styles.pointDesc}>{point.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className={styles.imageWrapper}>
          <div className={styles.imageBg}></div>
          <Image
            src={optimizedSrc}
            alt={data.heading || "ACI Product - Crafted by Nature"}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 500px"
            priority={false}
            unoptimized={isCloudinary}
          />
        </div>
      </div>
    </section>
  );
}
