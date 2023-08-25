import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'

import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { TRANSFORMERS } from '@lexical/markdown'

import ToolbarPlugin from './Plugins/Toolbar/Toolbar'

import { useState } from 'react'

import { EditorConfig } from './Config'
import MyCustomAutoFocusPlugin from './Plugins/Focus'

export function Editor() {
    const [title, setTitle] = useState('')

    const onChange = (e) => {
        if (typeof e.nativeEvent !== 'undefined') {
            setTitle(document.querySelector('.editor-title').innerText)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }

    const handlePaste = (e) => {
        // copy as plain text
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain')
        e.target.innerText = text

        setTitle(document.querySelector('.editor-title').innerText)
    }

    return (
        <LexicalComposer initialConfig={ EditorConfig }>
            <div>
                <ToolbarPlugin />
                <header className="relative mb-6">
                    <h1
                        className="editor-title relative z-10 font-serif font-semibold text-4xl outline-0 leading-tight"
                        onInput={ (e) => onChange(e) }
                        onKeyDown={ (e) => handleKeyDown(e) }
                        onPaste={ (e) => handlePaste(e) }
                        contentEditable>
                    </h1>
                    { title === '' && <div className="absolute inset-0 h-full font-serif font-semibold text-4xl text-gray-400">Your Post Title</div> }
                </header>
                <div className="relative">
                    <RichTextPlugin
                        contentEditable={ <ContentEditable className="relative z-10 outline-0 font-serif text-lg" /> }
                        placeholder={ <EditorPlaceholder /> }
                        ErrorBoundary={ LexicalErrorBoundary }
                    />
                </div>
            </div>
            <HistoryPlugin />
            <LinkPlugin />
            <ListPlugin />
            <MarkdownShortcutPlugin transformers={ TRANSFORMERS } />
            <MyCustomAutoFocusPlugin />
            <OnChangePlugin onChange={ onChange }/>
        </LexicalComposer>
    )
}

function EditorPlaceholder() {
    return (
        <div className="absolute top-0 left-0 right-0 font-serif text-lg text-gray-400">
            Start writing your post content here...
        </div>
    )
}