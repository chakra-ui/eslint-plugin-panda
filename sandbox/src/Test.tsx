/* eslint-disable @typescript-eslint/no-unused-vars */
// * Too much errors in this file? It's intentional. Thanks for your concern. 🙏

import { css } from '../styled-system/css'
import { panda } from '../styled-system/jsx'
import { stack } from '../styled-system/patterns'

//@ts-expect-error noidea
const literal = css` 
  background: {colors.bg};
  color: {colors.red.400};
`

function Test() {
  return (
    <div
      className={stack({
        color: 'red.400',
        background: 'bg',
        debug: true,
      })}
    >
      <panda.div bg="bg" borderYColor="red.400">
        Element 2
      </panda.div>
    </div>
  )
}

export default Test
