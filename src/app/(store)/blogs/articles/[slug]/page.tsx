import Image from "next/image";
import Link from "next/link";
import styles from "./Article.module.css";
import { notFound } from "next/navigation";

// Real database logic (Mocked for now)
async function getArticleData(slug: string) {
  const articlesDB = {
    "how-to-use-ashwagandha-powder-with-water": {
      title: "HOW TO USE ASHWAGANDHA POWDER WITH WATER: A COMPLETE GUIDE TO DAILY AYURVEDIC WELLNESS",
      breadcrumbTitle: "How to Use Ashwagandha Powder with Water: A Complete Guide to Daily Ayurvedic Wellness",
      image: "/certifiedIcons/product.jpeg", 
      content: (
        <>
          <p>
            Quick Answer: Ashwagandha powder can be easily consumed by mixing half to one teaspoon in 200 to 300 milliliters of lukewarm water. Drinking it on an empty stomach in the morning allows for optimal absorption, supports stress reduction, boosts immunity, enhances energy, and promotes hormonal balance. This method is simple, natural, and suitable for daily use.
          </p>

          <p>
            If you are looking for a natural way to manage stress, improve energy levels, and support overall wellness, knowing how to use ashwagandha powder with water is an excellent starting point. Ashwagandha, one of the most revered herbs in Ayurveda, has been used for centuries to promote vitality, mental clarity, and hormonal balance. In this comprehensive guide, we will explain step-by-step how to consume ashwagandha powder with water, the optimal timing, alternative consumption methods, dosage recommendations, and frequently asked questions to help you maximize its benefits in a safe and effective way.
          </p>

          <h2>WHAT IS ASHWAGANDHA POWDER?</h2>

          <h3>THE AYURVEDIC SUPER-HERB YOU NEED</h3>
          <p>
            Ashwagandha, scientifically known as <em>Withania somnifera</em>, is often referred to as Indian ginseng because of its rejuvenating and adaptogenic qualities. It has long been used in Ayurveda to enhance stamina, strengthen immunity, and help the body manage stress more effectively. The dried root is finely ground into an <a>ayurvedic herbal powder</a> that can be easily mixed with water for everyday use.
          </p>

          <h3>TRADITIONAL USES VERSUS MODERN APPLICATIONS</h3>
          <p>
            In traditional Ayurvedic practices, ashwagandha was often used in the form of decoctions, tonics, and herbal pastes. Modern usage has made it more convenient with the availability of capsules, tablets, and powdered forms. Among these, the powder remains the most versatile and adaptable for daily use. Drinking it with water is considered one of the simplest ways to gain its full benefits because it is easily absorbed by the body and does not require heavy digestion.
          </p>

          <h3>WHY POWDER FORM IS EFFECTIVE</h3>
          <p>
            Powdered ashwagandha is highly effective for daily consumption because it allows for accurate dosing and flexibility. You can start with a small amount and gradually increase based on your body's tolerance. Drinking ashwagandha powder with water helps the nutrients absorb quickly, provides a lighter option for those who cannot consume milk, and is suitable for morning routines aimed at stress reduction and energy enhancement.
          </p>

          {/* 🟢 FEATURE 1: EXTRA CUSTOM HEADINGS & CONTENT */}
          <h2>YOUR CUSTOM HEADING HERE</h2>
          <p>
            Yahan par aap apna koi bhi extra paragraph, images ya list add kar sakte hain. Kyunki yeh pura section React (JSX) me likha hai, aapko bas <code>&lt;h2&gt;</code> ya <code>&lt;p&gt;</code> tags ka use karna hai nayi cheezein dalne ke liye.
          </p>
        </>
      ),
      // 🟢 FEATURE 2: FAQs ARRAY (Aap yahan kitne bhi questions add kar sakte ho)
      faqs: [
        {
          question: "Can I take Ashwagandha with water instead of milk?",
          answer: "Yes, taking Ashwagandha with lukewarm water is highly effective and a great alternative for those who are lactose intolerant or prefer a lighter option."
        },
        {
          question: "What is the best time to drink Ashwagandha water?",
          answer: "For stress relief and better sleep, consume it 30-45 minutes before bedtime. For daily energy, taking it in the morning on an empty stomach is ideal."
        },
        {
          question: "Can I drink it every day?",
          answer: "Yes, Ashwagandha is generally safe for daily consumption. However, it is recommended to start with a smaller dose and consult an Ayurvedic practitioner if you have specific health conditions."
        }
      ]
    }
  };

  // @ts-ignore
  return articlesDB[slug] || null;
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleData(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* EXACT BREADCRUMB */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>·</span>
          <Link href="/blogs/articles">Articles</Link>
          <span>·</span>
          <span>{article.breadcrumbTitle}</span>
        </nav>

        {/* EXACT HERO IMAGE */}
        <div className={styles.imageWrapper}>
          <Image
            src={article.image}
            alt="Ashwagandha Powder"
            fill
            className={styles.image}
            priority
          />
        </div>

        {/* CONTENT & FAQs LAYOUT */}
        <div className={styles.contentContainer}>
          <h1 className={styles.mainTitle}>{article.title}</h1>
          
          <div className={styles.content}>
            {article.content}
          </div>

          {/* 🟢 FAQs RENDER SECTION */}
          {article.faqs && article.faqs.length > 0 && (
            <div className={styles.faqSection}>
              <h2>FREQUENTLY ASKED QUESTIONS</h2>
              {article.faqs.map((faq: { question: string; answer: string }, index: number) => (
                <div key={index} className={styles.faqItem}>
                  <div className={styles.faqQuestion}>{faq.question}</div>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}