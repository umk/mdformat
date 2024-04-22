import { Lexer } from 'marked'

import Content from './Content'
import Render, { createRender } from './Render'
import Token from './Token'

function renderTemplateToTokens(
  content: string | Token | Array<Token> | Render,
  data: Content,
  lexer?: Lexer,
) {
  const render = typeof content === 'function' ? content : createRender(content, lexer)
  return render(data)
}

export default renderTemplateToTokens
