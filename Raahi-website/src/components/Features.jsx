import React from 'react';

import assets from '../assets';
import styles from '../styles/Global';

const FeatureCard = ({ iconUrl, iconText }) =>  (
  <div className={styles.featureCard}>
    <img src={iconUrl} alt="icon" className={styles.featureImg} />
    <p className={styles.featureText}>{iconText}</p>
  </div>
)

const Features = () => {
  return (
    <div className={`${styles.section} ${styles.bgPrimary} banner03`}>
      <div className={`${styles.subSection} flex-col text-center`}>
        <div>
          <h1 className={`${styles.h1Text} ${styles.whiteText}`}>Technologies</h1>
          <p className={`${styles.pText} ${styles.whiteText}`}>Raahi has been developed using a cross-platform technology, React Native, Spring Boot and more.</p>
        </div>

        <div className={styles.flexWrap}>
          <FeatureCard iconUrl={assets.react} iconText="React Native" />
          <FeatureCard iconUrl={assets.javascript} iconText="JavaScript" />
          <FeatureCard iconUrl={assets.firebase} iconText="Firebase" />
          <FeatureCard iconUrl={assets.springboot} iconText="Spring Boot" />
          <FeatureCard iconUrl={assets.postresql} iconText="Postgresql" />
          <FeatureCard iconUrl={assets.docker} iconText="Docker" />
        </div>
      </div>
    </div>
  )
}

export default Features