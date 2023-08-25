import { Theme } from './Theme'

import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'

export const EditorConfig = {
    namespace: 'MyEditor',
    theme: Theme,
    onError: (error) => {
        console.error(error)
    },
    nodes: [
        HeadingNode,
        QuoteNode,
        TableCellNode,
        TableNode,
        TableRowNode,
        ListItemNode,
        ListNode,
        CodeHighlightNode,
        CodeNode,
        AutoLinkNode,
        LinkNode,
    ]
}