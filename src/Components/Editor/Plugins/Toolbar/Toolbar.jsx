import { useRef, useEffect, useState, useCallback } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import {
    CAN_UNDO_COMMAND,
    CAN_REDO_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode
} from 'lexical'

import {
    $isListNode,
    ListNode,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND
} from '@lexical/list'

import {
    $isHeadingNode,
    $createHeadingNode,
    $createQuoteNode
} from '@lexical/rich-text'

import {
    mergeRegister,
    $getNearestNodeOfType
} from '@lexical/utils'

import {
    $setBlocksType
} from '@lexical/selection'

import {
    ButtonEnabled,
    ButtonFormat
} from './ToolbarButton'

const LowPriority = 1;

export default function ToolbarPlugin() {
    const toolbarRef = useRef(null)

    const [blockType, setBlockType] = useState('paragraph')
    const [selectedElementKey, setSelectedElementKey] = useState(null)

    const [canUndo, setCanUndo] = useState(false)
    const [canRedo, setCanRedo] = useState(false)
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isUnderline, setIsUnderline] = useState(false)
    const [isStrikethrough, setIsStrikethrough] = useState(false)

    const [editor] = useLexicalComposerContext()

    const updateToolbar = useCallback(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'))
            setIsItalic(selection.hasFormat('italic'))
            setIsUnderline(selection.hasFormat('underline'))
            setIsStrikethrough(selection.hasFormat('strikethrough'))

            const anchorNode = selection.anchor.getNode()
            const element =
                anchorNode.getKey() === "root"
                ? anchorNode
                : anchorNode.getTopLevelElementOrThrow()
            const elementKey = element.getKey()
            const elementDOM = editor.getElementByKey(elementKey)

            if (elementDOM !== null) {
                setSelectedElementKey(elementKey)

                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(anchorNode, ListNode)
                    const type = parentList ? parentList.getTag() : element.getTag()

                    setBlockType(type)
                } else {
                    const type = $isHeadingNode(element)
                        ? element.getTag()
                        : element.getType()

                    setBlockType(type)
                }
            }
        }
    }, [editor])

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar()
                })
            }),
            editor.registerCommand(CAN_UNDO_COMMAND, (payload) => {
                setCanUndo(payload)
                return false
            }, LowPriority),
            editor.registerCommand(CAN_REDO_COMMAND, (payload) => {
                setCanRedo(payload)
                return false
            }, LowPriority),
        )
    }, [editor, updateToolbar])

    return (
        <div className="h-16 py-4" ref={ toolbarRef }>
            <div className="flex justify-center fixed top-0 left-0 right-0 h-16 z-30 py-4 px-4 bg-white border-b">
                <div className="hidden md:flex gap-1 h-full items-center">
                    <ButtonEnabled
                        title="Undo"
                        isEnabled={ canUndo }
                        onClick={ () => editor.dispatchCommand(UNDO_COMMAND) }>
                        <span className="material-symbols-outlined">undo</span>
                    </ButtonEnabled>
                    <ButtonEnabled
                        title="Redo"
                        isEnabled={ canRedo }
                        onClick={ () => editor.dispatchCommand(REDO_COMMAND) }>
                        <span className="material-symbols-outlined">redo</span>
                    </ButtonEnabled>
                </div>
                <div className="hidden md:flex h-full w-px bg-gray-300 mx-2"></div>
                <div className="flex gap-1 h-full items-center">
                    <ButtonFormat
                        title="Heading 2"
                        isActive={ blockType === 'h2' }
                        onClick={ () => formatBlockType(editor, blockType === 'h2' ? 'paragraph' : 'h2') }>
                        <span className="material-symbols-outlined">format_h2</span>
                    </ButtonFormat>
                    <ButtonFormat
                        title="Heading 3"
                        isActive={ blockType === 'h3' }
                        onClick={ () => formatBlockType(editor, blockType === 'h3' ? 'paragraph' : 'h3') }>
                        <span className="material-symbols-outlined">format_h3</span>
                    </ButtonFormat>
                    <ButtonFormat
                        title="Quote"
                        isActive={ blockType === 'quote' }
                        onClick={ () => formatBlockType(editor, blockType === 'quote' ? 'paragraph' : 'quote') }>
                        <span className="material-symbols-outlined">format_quote</span>
                    </ButtonFormat>
                </div>
                <div className="hidden md:flex h-full w-px bg-gray-300 mx-2"></div>
                <div className="flex gap-1 h-full items-center">
                    <ButtonFormat
                        title="Bold"
                        isActive={ isBold }
                        onClick={ () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold') }>
                        <span className="material-symbols-outlined">format_bold</span>
                    </ButtonFormat>
                    <ButtonFormat
                        title="Italic"
                        isActive={ isItalic }
                        onClick={ () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic') }>
                        <span className="material-symbols-outlined">format_italic</span>
                    </ButtonFormat>
                    <ButtonFormat
                        title="Underline"
                        isActive={ isUnderline }
                        onClick={ () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline') }>
                        <span className="material-symbols-outlined">format_underlined</span>
                    </ButtonFormat>
                    <ButtonFormat
                        title="Strikethrough"
                        isActive={ isStrikethrough }
                        onClick={ () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough') }>
                        <span className="material-symbols-outlined">strikethrough_s</span>
                    </ButtonFormat>
                </div>
                <div className="hidden md:flex h-full w-px bg-gray-300 mx-2"></div>
                <div className="flex gap-1 h-full items-center">
                    <ButtonFormat
                        title="Bullet"
                        isActive={ blockType === 'ul' }
                        onClick={ () => formatBlockType(editor, blockType === 'ul' ? 'not-bullet' : 'bullet') }>
                        <span className="material-symbols-outlined">format_list_bulleted</span>
                    </ButtonFormat>
                    <ButtonFormat
                        title="Number"
                        isActive={ blockType === 'ol' }
                        onClick={ () => formatBlockType(editor, blockType === 'ol' ? 'not-number' : 'number') }>
                        <span className="material-symbols-outlined">format_list_numbered</span>
                    </ButtonFormat>
                </div>
                <div className="hidden md:flex h-full w-px bg-gray-300 mx-2"></div>
                <div className="hidden md:flex gap-1 h-full items-center">
                    <ButtonFormat
                        title="Align Left"
                        isActive={ false }
                        onClick={ () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}>
                        <span className="material-symbols-outlined">format_align_left</span>
                    </ButtonFormat>
                    <ButtonFormat
                        title="Align Center"
                        isActive={ false }
                        onClick={ () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}>
                        <span className="material-symbols-outlined">format_align_center</span>
                    </ButtonFormat>
                    <ButtonFormat
                        title="Align Right"
                        isActive={ false }
                        onClick={ () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}>
                        <span className="material-symbols-outlined">format_align_right</span>
                    </ButtonFormat>
                    <ButtonFormat
                        title="Align Justify"
                        isActive={ false }
                        onClick={ () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}>
                        <span className="material-symbols-outlined">format_align_justify</span>
                    </ButtonFormat>
                </div>
            </div>
        </div>
    )
}

const formatBlockType = (editor, blockType) => {
    switch (blockType) {
        case 'h2':
        case 'h3':
            editor.update(() => {
                const selection = $getSelection()

                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createHeadingNode(blockType))
                }
            })
            break;
        case 'quote':
            editor.update(() => {
                const selection = $getSelection()

                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createQuoteNode())
                }
            })
            break;
        case 'bullet':
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
            break;
        case 'not-bullet':
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
            break;
        case 'number':
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
            break;
        case 'not-number':
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
            break;
        default:
            editor.update(() => {
                const selection = $getSelection()

                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createParagraphNode())
                }
            })
            break;
    }
}