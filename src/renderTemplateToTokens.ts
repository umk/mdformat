import type { Lexer, MarkedToken } from 'marked'

import type { Content } from './Content'
import type { Render } from './Render'
import { createRender } from './Render'
import type { Token } from './Token'

export function renderTemplateToTokens(
  template: string | Token | Array<Token> | Render,
  data: Content,
  lexer?: Lexer,
): Array<MarkedToken> {
  const render = typeof template === 'function' ? template : createRender(template, lexer)
  return render(data) as Array<MarkedToken>
}
