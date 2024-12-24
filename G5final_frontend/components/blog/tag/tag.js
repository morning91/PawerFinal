import React, { useState } from 'react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Tag({
  label = '',
  tagLength = 0,
  placeholder = '',
  required = false,
  tags = [],
  setTags,
}) {
  const [tag, setTag] = useState('');
  const [options, setOptions] = useState([]);

  const deleteTag = (i) => {
    const dupTags = [...tags];
    dupTags.splice(i, 1);
    setTags(dupTags);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/tags');
        if (!response.ok) {
          throw new Error('網路回應不成功：' + response.status);
        }
        const tags = await response.json();
        const options = tags.map((item) => ({
          id: item.ID,
          name: item.Name,
        }));
        setOptions(options);
      } catch (err) {
        console.error('錯誤：', err);
      }
    };
    fetchData();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = tag.trim();
      if (!newTag) return;

      if (tags.length >= tagLength) {
        Swal.fire(`最多只能輸入 ${tagLength} 個標籤`);
        return;
      }

      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }

      setTimeout(() => {
        setTag('');
      }, 0);
    }
  };

  return (
    <div className="mb-3 tag-input-box">
      <label
        htmlFor="tag-input"
        className={`form-label mb-2 ${required ? 'required' : ''}`}
      >
        {label}
      </label>
      <div className="tag-container d-flex">
        {tags.map((tag, i) => {
          return (
            <div key={i} className={` btn btn-warning rounded-2 mx-1 d-flex `}>
              <p className={` text-white text-nowrap m-0`}>
                {tag}
                <span className="ps-1" onClick={() => deleteTag(i)}>
                  &times;
                </span>
              </p>
            </div>
          );
        })}
        <input
          className="tag-input form-control"
          id="tag-input"
          type="text"
          value={tag}
          placeholder={placeholder}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
