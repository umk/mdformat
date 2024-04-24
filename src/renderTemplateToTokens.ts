import { Lexer } from 'marked'

import Content from './Content'
import Render, { createRender } from './Render'
import Token from './Token'

function renderTemplateToTokens(
  template: string | Token | Array<Token> | Render,
  data: Content,
  lexer?: Lexer,
) {
  const render = typeof template === 'function' ? template : createRender(template, lexer)
  return render(data)
}

export default renderTemplateToTokens
