'use client';

import { memo, useMemo } from 'react';
import JoditEditor from 'jodit-react';

import 'jodit/es2021/jodit.min.css';

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  height?: number;
}

const RichEditor = memo(    
  ({
    value,
    onChange,
    placeholder = 'Write here...',
    height = 420,
  }: RichEditorProps) => {
    const config = useMemo(
      () => ({
        readonly: false,
        height,
        placeholder,

        theme: 'default',

        toolbarAdaptive: false,

        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,

        allowResizeX: false,
        allowResizeY: false,

        defaultMode: 1,

        buttons: [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          '|',
          'ul',
          'ol',
          '|',
          'h1',
          'h2',
          'h3',
          '|',
          'link',
          'image',
          '|',
          'blockquote',
          'hr',
          '|',
          'align',
          '|',
          'undo',
          'redo',
          '|',
          'source',
        ],

        style: {
          background: '#0F0D1A',
          color: '#E8E2F4',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          lineHeight: '1.75',
        },
      }),
      [height, placeholder]
    );

    return (
      <div className="rich-editor overflow-hidden rounded-[18px] border border-[#2E2847] bg-[#0F0D1A] transition-all duration-200 focus-within:border-[#9B7AD9]">
        <JoditEditor
          value={value}
          config={config}
          onBlur={(newContent) =>
            onChange(newContent)
          }
        />

        <style jsx global>{`
          .rich-editor .jodit-container {
            border: none !important;
            background: #0f0d1a !important;
          }

          .rich-editor .jodit-toolbar__box {
            background: #1c1629 !important;
            border-bottom: 1px solid #2e2847 !important;
            padding: 8px !important;
          }

          .rich-editor .jodit-toolbar-button {
            border-radius: 10px !important;
          }

          .rich-editor
            .jodit-toolbar-button:hover {
            background: #2e2847 !important;
          }

          .rich-editor
            .jodit-toolbar-button__button {
            color: #c9b8e8 !important;
          }

          .rich-editor
            .jodit-toolbar-button__icon
            svg {
            fill: #c9b8e8 !important;
          }

          .rich-editor
            .jodit-toolbar-button_active
            .jodit-toolbar-button__button {
            background: #2e2847 !important;
            color: #9b7ad9 !important;
          }

          .rich-editor
            .jodit-toolbar-button_active
            svg {
            fill: #9b7ad9 !important;
          }

          .rich-editor .jodit-separator {
            border-color: #2e2847 !important;
          }

          .rich-editor .jodit-workplace {
            background: #0f0d1a !important;
          }

          .rich-editor .jodit-wysiwyg {
            background: #0f0d1a !important;
            color: #e8e2f4 !important;
            padding: 24px !important;
          }

          .rich-editor .jodit-wysiwyg h1,
          .rich-editor .jodit-wysiwyg h2,
          .rich-editor .jodit-wysiwyg h3 {
            color: #c9b8e8 !important;
          }

          .rich-editor .jodit-wysiwyg a {
            color: #9b7ad9 !important;
          }

          .rich-editor
            .jodit-wysiwyg
            blockquote {
            border-left: 3px solid #9b7ad9 !important;
            padding-left: 16px !important;
            color: #a89bc8 !important;
          }

          .rich-editor .jodit-status-bar {
            background: #1c1629 !important;
            border-top: 1px solid #2e2847 !important;
            color: #6b5f8a !important;
          }

          .rich-editor .jodit-source__mirror {
            background: #0f0d1a !important;
            color: #c9b8e8 !important;
          }

          .rich-editor .jodit-popup__content {
            background: #1c1629 !important;
            border: 1px solid #2e2847 !important;
            border-radius: 14px !important;
          }

          .rich-editor .jodit-input {
            background: #0f0d1a !important;
            border: 1px solid #2e2847 !important;
            color: #e8e2f4 !important;
            border-radius: 10px !important;
          }

          .rich-editor .jodit-dialog {
            background: #1c1629 !important;
            border: 1px solid #2e2847 !important;
            border-radius: 18px !important;
          }

          .rich-editor .jodit-dialog__header {
            background: #1c1629 !important;
            border-bottom: 1px solid #2e2847 !important;
            color: #e8e2f4 !important;
          }

          .rich-editor .jodit-dialog__footer {
            background: #1c1629 !important;
            border-top: 1px solid #2e2847 !important;
          }
        `}</style>
      </div>
    );
  }
);

RichEditor.displayName = 'RichEditor';

export default RichEditor;