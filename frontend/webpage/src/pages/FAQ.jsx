import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FAQ.module.css';
import airplane from '../assets/airplanes.jpg';
import FooterBar from '../components/FooterBar';

function FAQ() {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState(null);

    const faqItems = [
        {
            question: t('faq.q1'),
            answer: t('faq.a1'),
        },
        {
            question: t('faq.q2'),
            answer: t('faq.a2'),
        },
        {
            question: t('faq.q3'),
            answer: t('faq.a3'),
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div>
            <div className={styles.faqPage}>
                <div className={styles.faqContainer}>
                    <h1>{t('faq.title')}</h1>
                    <div className={styles.faqList}>
                        {faqItems.map((item, index) => (
                            <div key={index} className={styles.faqItem}>
                                <button
                                    className={styles.question}
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <span>{item.question}</span>
                                    <span className={styles.icon}>
                                        {openIndex === index ? '−' : '+'}
                                    </span>
                                </button>
                                {openIndex === index && (
                                    <div className={styles.answer}>{item.answer}</div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className={styles.imageWrap}>
                        <div className={styles.imageCard}>
                            <img
                                src={airplane}
                                alt={t('faq.imageAlt') || 'Airplanes'}
                                className={styles.airplaneImage}
                                />
                        </div>
                    </div>
                </div>
            </div>
        <FooterBar />
        </div>
    );
}

export default FAQ;
