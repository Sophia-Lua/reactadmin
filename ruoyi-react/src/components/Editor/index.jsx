import React, { forwardRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const Editor = forwardRef(({ value, onChange, style = {} }, ref) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  }

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'align',
    'blockquote', 'code-block', 'link', 'image', 'video',
  ]

  return (
    <div className="editor-container" style={style}>
      <ReactQuill
        ref={ref}
        theme="snow"
        modules={modules}
        formats={formats}
        value={value || ''}
        onChange={onChange}
      />
    </div>
  )
})

export default Editor
