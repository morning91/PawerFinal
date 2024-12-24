import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from './banner.module.scss';

export default function Banner({
  bgImgUrl = '',
  imgCover = 'cover',
  url = '',
}) {
  const router = useRouter();

  const [data, setData] = useState({ ID: 0, Title: '' });

  useEffect(() => {
    if (router.isReady && router.query.id) {
      // console.log('ID:', router.query.id);
      if (url) {
        getTitle(router.query.id);
      }
    }
  }, [router.isReady, router.query.id, url]);

  const getTitle = async (id) => {
    const apiUrl = `${url}/${id}`;
    try {
      const res = await fetch(apiUrl);
      const resData = await res.json();

      if (Array.isArray(resData) && resData.length > 0) {
        const blogData = resData[0];
        setData(blogData);
        // console.log('取得的文章標題:', blogData.Title);
      } else {
        console.log('資料格式錯誤');
      }
    } catch (error) {
      console.log('無法取得文章資料:', error);
    }
  };

  const bannerTitle = data.Title || '部落格專區';
  return (
    <div className={`${styles['bl-banner']} text-center`}>
      <div className={styles['image-container']}>
        <Image
          src={bgImgUrl}
          alt="Banner Image"
          fill
          quality={100}
          style={{ objectFit: imgCover }}
        />
        <div className={styles['overlay']}></div>
        <h2 className={`${styles['banner-title']}`}>{bannerTitle}</h2>
      </div>
    </div>
  );
}
