import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

export default function MyCustomAutoFocusPlugin() {
    const [editor] = useLexicalComposerContext()
  
    useEffect(() => {
      // Focus the editor when the effect fires!
      editor.focus()
    }, [editor])
  
    return null
}