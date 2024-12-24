import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Link from 'next/link';

import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs';
import Myeditor from '@/components/join/CKEditorTest';
import { useBlogDel } from '@/hooks/use-blog/useBlogDel';
import Tag from '@/components/blog/tag/tag';

import { BsBookmarkFill, BsReplyFill } from 'react-icons/bs';
import { FaUpload, FaTrashAlt } from 'react-icons/fa';

export default function BlogEdit() {
  const { auth } = useAuth();
  const uid = auth.memberData.id;
  const router = useRouter();
  const { id } = router.query;

  const [imageName, setImageName] = useState('尚未選擇封面');
  const [previewImage, setPreviewImage] = useState('/blog/img.png');
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [data, setData] = useState('');
  const [updateDate, setUpdateDate] = useState('');

  // 標籤
  const [tags, setTags] = useState([]);
  const handleTagsChange = (newTags) => {
    setTags(newTags);
  };

  useEffect(() => {
    if (!id) return;
    const fetchBlogData = async () => {
      try {
        const response = await fetch(`http://localhost:3005/api/blog/${id}`);
        if (response.ok) {
          const blogData = await response.json();
          // console.log('抓取到的文章資料:', blogData);
          const blog = blogData[0];
          // console.log(blog);
          setTitle(blog.Title);
          setData(blog.Content);
          const tagsArray = blog.tags
            ? blog.tags.split(',').map((tag) => tag.trim())
            : [];
          setTags(tagsArray);
          setUploadedImageUrl(blog.blogImg);
          setPreviewImage(blog.blogImg);
          setImageName(blog.imageName || '尚未選擇封面');
          setUpdateDate(blog.UpdateDate);
        } else {
          throw new Error('無法取得文章資料');
        }
      } catch (error) {
        console.error(error);
        toast.error('文章資料載入失敗');
      }
    };

    fetchBlogData();
    setEditorLoaded(true);
  }, [id]);

  // 圖片預覽上傳
  const uploadCover = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error('沒有選擇任何檔案');
      return;
    }
    // 檢視圖檔類型
    const imageTypes = [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/jfif',
    ];
    if (!imageTypes.includes(file.type)) {
      toast('請選擇有效的圖片檔案 (.jpg, .jpeg, .png, .webp, .svg, .jfif)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('imageFile', file);
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }
    try {
      const response = await fetch('http://localhost:3005/api/blog/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setUploadedImageUrl(data.url);
        setImageName(data.name);
        console.log('上傳成功:', data.url);
      } else {
        console.error('上傳失敗:', data.message);
      }
    } catch (error) {
      console.error('發生錯誤:', error);
    }
  };

  const handleUpdate = async (e, action) => {
    if (action === 'upload') {
      if (!uploadedImageUrl) {
        toast.error('請上傳封面');
        return;
      }
      if (!title) {
        toast.error('標題是必填欄位');
        return;
      }

      if (!data) {
        toast.error('內容是必填欄位');
        return;
      }
    }

    const status = action === 'upload' ? '1' : '0';

    const updatedData = {
      status,
      title,
      content: data,
      memberId: uid,
      tags: JSON.stringify(tags),
      imageName: imageName === '尚未選擇封面' ? '' : imageName,
      blogId: id,
    };

    try {
      const response = await fetch(
        `http://localhost:3005/api/blog/edit/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success('文章更新成功!', result);
        router.push('http://localhost:3000/member/blog');
      } else {
        const errorData = await response.json();
        console.error('更新失敗:', errorData.message);
        toast.error('文章更新失敗');
      }
    } catch (error) {
      console.error('發生錯誤:', error);
      toast.error('發生錯誤');
    }
  };

  // 刪除文章
  const delBlogt = useBlogDel(id);

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  return (
    <div className="bl-edit">
      <div className="bl-edit-main container">
        <Breadcrumbs />
        <div className="main-section">
          {/* 標題 */}
          <div className="blog-edit-title">
            <h5>編輯文章</h5>
            <Image src="/blog/line.svg" alt="" width={64} height={2} />
          </div>

          {/* 文章封面 */}
          <div className="card-section cover shadow rounded-1">
            <div id="image-preview-wrapper" className="image-preview-wrapper">
              <Image
                src={uploadedImageUrl || previewImage}
                alt="圖片預覽"
                fill
                style={{
                  objectFit: uploadedImageUrl ? 'cover' : 'scale-down',
                }}
              />
            </div>

            <div className="cover-info">
              <label className="required" htmlFor="imageName">
                文章封面
              </label>
              <div className="upload-section">
                <div className="input-group">
                  <button
                    className="btn btn-primary"
                    onClick={() => fileInputRef.current.click()}
                  >
                    選擇封面
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    id="imageName"
                    name="imageName"
                    style={{ display: 'none' }}
                    onChange={uploadCover}
                  />
                  <input
                    className="form-control"
                    placeholder={imageName}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 輸入標題 */}
          <div className="card-section shadow rounded-1">
            <div className="blog-input">
              <label className="required" htmlFor="title">
                文章標題
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                placeholder="請填寫文章標題"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* 文章編輯器 */}
            <div className="blog-input">
              <label className="required" htmlFor="editor-container">
                文章內容
              </label>
              <div id="editor-container"></div>
              <input type="hidden" id="edit" name="edit" />
              <Myeditor
                name="article"
                value={data}
                onChange={(data) => {
                  setData(data);
                }}
                editorLoaded={editorLoaded}
              />
            </div>

            {/* 標籤 */}
            <Tag
              label="文章標籤"
              placeholder="輸入文章＃標籤"
              tagLength={5}
              tags={tags}
              setTags={handleTagsChange}
            />
            <div className="d-flex" style={{ color: '#646464' }}>
              上次更新時間：
              <p style={{ color: '#646464' }}>{updateDate}</p>
            </div>
          </div>

          {/* 底部按鈕 */}
          <div className="blog-bottom-btn">
            <button className="btn btn-danger" type="button" onClick={delBlogt}>
              刪除
            </button>
            <div className="btn-group">
              <Link
                href={`/member/blog`}
                type="button"
                className="btn col btn-outline-primary text-decoration-none"
              >
                返回
              </Link>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={(e) => handleUpdate(e, 'draft')}
              >
                儲存草稿
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => handleUpdate(e, 'upload')}
              >
                發佈文章
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 手機按鈕 */}
      <div className="blog-bottom-btn-mobile">
        <button
          className="col btn-mobile text-decoration-none"
          type="button"
          onClick={delBlogt}
        >
          <FaTrashAlt className="icon" />
          刪除
        </button>
        <Link
          href={`/member/blog`}
          type="button"
          className="col d-flex justify-content-center text-decoration-none"
        >
          <button className="btn-mobile">
            <BsReplyFill className="icon" />
            返回
          </button>
        </Link>
        <button className="col btn-mobile">
          <BsBookmarkFill
            className="icon "
            onClick={(e) => handleUpdate(e, 'draft')}
          />
          儲存草稿
        </button>
        <button
          className="col btn-mobile"
          onClick={(e) => handleUpdate(e, 'upload')}
        >
          <FaUpload className="icon" />
          發佈文章
        </button>
      </div>
    </div>
  );
}
