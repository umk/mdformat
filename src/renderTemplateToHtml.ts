import { type Lexer, Parser } from 'marked'

import type { Content } from './Content'
import type { Render } from './Render'
import type { Token } from './Token'
import { renderTemplateToTokens } from './renderTemplateToTokens'

export function renderTemplateToHtml(
  template: string | Token | Array<Token> | Render,
  data: Content,
  lexer?: Lexer,
  parser?: Parser,
) {
  const rendered = renderTemplateToTokens(template, data, lexer)
  return (parser ?? new Parser()).parse(rendered)
}
