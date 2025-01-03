import React from 'react';
import styles from './sidebar-card.module.scss';
import Image from 'next/image';

const SideBarCard = ({ title, img, content, filterData }) => {
  return (
    <div className={`rounded-1 shadow ${styles['sidebar-card']}`}>
      {img && (
        <div className={styles.img}>
          <Image src={img} alt={img} className="pawbutton" fill />
        </div>
      )}
      {title && (
        <div className={styles.title}>
          <h5 className={styles.h5}>{title}</h5>
        </div>
      )}
      <div className={styles['content']}>{content}</div>
    </div>
  );
};

export default SideBarCard;
