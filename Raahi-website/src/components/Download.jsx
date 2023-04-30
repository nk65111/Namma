import React from 'react';

import styles from '../styles/Global';

const Download = () => {
  return (
    <div className={`${styles.section} ${styles.bgWhite}`}>
      <div className={`${styles.subSection} flex-col text-center`}>
        <div>
          <h1 className={`${styles.h1Text} ${styles.blackText}`}>Download the Source Code</h1>
          <p className={`${styles.pText} ${styles.blackText}`}>Get the full source code on GitHub</p>
        </div>
        <a href='https://github.com/nk65111/Namma' target='_blank' className={styles.btnPrimary}>Source Code</a>
        <div className={styles.flexCenter}>
        </div>
      </div>
    </div>
  )
}

export default Download