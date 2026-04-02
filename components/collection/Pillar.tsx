import Image from 'next/image';
import styles from './Pillar.module.css';

const pillars = [
  {
    icon: '/certifiedIcons/Asset_12.svg',
    title: '100% Natural',
    description: 'Our products are made from 100% natural and organic ingredients, free from harmful chemicals.',
  },
  {
    icon: '/certifiedIcons/Asset_13.svg',
    title: 'Cruelty-Free',
    description: 'We are committed to cruelty-free practices. None of our products are tested on animals.',
  },
  {
    icon: '/certifiedIcons/Asset_14.svg',
    title: 'Ayurvedic Formula',
    description: 'Based on ancient Ayurvedic wisdom, our formulations are designed for holistic well-being.',
  },
  {
    icon: '/certifiedIcons/Asset_17.svg',
    title: 'Quality Assured',
    description: 'Every product undergoes rigorous quality checks to ensure the highest standards of purity and efficacy.',
  },
];

export default function VedistPillar() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>ACI PILLAR</h2>
      <div className={styles.grid}>
        {pillars.map((pillar) => (
          <div key={pillar.title} className={styles.pillarItem}>
            <div className={styles.iconWrapper}>
              <Image src={pillar.icon} alt={pillar.title} width={80} height={80} />
            </div>
            <h3 className={styles.title}>{pillar.title}</h3>
            <p className={styles.description}>{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}