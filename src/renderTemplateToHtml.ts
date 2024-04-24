import { Lexer, Parser } from 'marked'

import Content from './Content'
import Render from './Render'
import Token from './Token'
import renderTemplateToTokens from './renderTemplateToTokens'

function renderTemplateToHtml(
  template: string | Token | Array<Token> | Render,
  data: Content,
  lexer?: Lexer,
  parser?: Parser,
) {
  const rendered = renderTemplateToTokens(template, data, lexer)
  return (parser ?? new Parser()).parse(rendered)
}

export default renderTemplateToHtml
