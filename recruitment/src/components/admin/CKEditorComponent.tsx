'use client';

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorComponentProps {
    content?: string;
    onChange?: (html: string) => void;
    placeholder?: string;
}

export default function CKEditorComponent({
    content = '',
    onChange,
    placeholder = 'Nhập nội dung giới thiệu sự kiện...'
}: CKEditorComponentProps) {
    return (
        <div className="ckeditor-wrapper">
            <CKEditor
                editor={ClassicEditor as any}
                data={content}
                config={{
                    placeholder,
                    toolbar: {
                        items: [
                            'heading',
                            '|',
                            'bold',
                            'italic',
                            '|',
                            'bulletedList',
                            'numberedList',
                            '|',
                            'link',
                            'imageUpload',
                            'insertTable',
                            'mediaEmbed',
                            '|',
                            'blockQuote',
                            '|',
                            'undo',
                            'redo'
                        ],
                        shouldNotGroupWhenFull: true
                    },
                    heading: {
                        options: [
                            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
                        ]
                    },
                    table: {
                        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                    },
                    image: {
                        toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side']
                    },
                    language: 'vi'
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange?.(data);
                }}
            />
            <style jsx global>{`
                .ckeditor-wrapper .ck-editor__editable {
                    min-height: 300px;
                    border-radius: 0 0 0.5rem 0.5rem;
                }
                .ckeditor-wrapper .ck-editor__editable:focus {
                    border-color: #4ade80 !important;
                    box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2) !important;
                }
                .ckeditor-wrapper .ck.ck-toolbar {
                    border-radius: 0.5rem 0.5rem 0 0;
                    background: #f9fafb;
                }
                .ckeditor-wrapper .ck.ck-editor__main > .ck-editor__editable {
                    background: white;
                }
                .ckeditor-wrapper .ck-content h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                }
                .ckeditor-wrapper .ck-content h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                }
                .ckeditor-wrapper .ck-content h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                .ckeditor-wrapper .ck-content blockquote {
                    border-left: 4px solid #4ade80;
                    padding-left: 1rem;
                    color: #64748b;
                    font-style: italic;
                    margin: 1rem 0;
                }
                .ckeditor-wrapper .ck-content table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .ckeditor-wrapper .ck-content table td,
                .ckeditor-wrapper .ck-content table th {
                    border: 1px solid #e5e7eb;
                    padding: 0.5rem;
                }
                .ckeditor-wrapper .ck-content table th {
                    background-color: #f3f4f6;
                }
            `}</style>
        </div>
    );
}
