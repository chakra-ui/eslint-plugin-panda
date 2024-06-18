// * Too much errors in this file? It's intentional. Thanks for your concern. 🙏

import { defineKeyframes } from '@pandacss/dev'
import { css } from '../styled-system/css'
import { Circle, HStack, panda } from '../styled-system/jsx'
import { stack } from '../styled-system/patterns'
import { token } from '../styled-system/tokens'

const keyframes = defineKeyframes({
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
})

//@ts-expect-error noidea
const literal = css`
  margin-right: {sizess.4};
  padding-left: {sizess.4};
  font-weight: token(fontWeightss.bold, 700);
`

console.log(keyframes, literal)

const LocalFactoryComp = panda('button')

function App() {
  const className = css({
    bg: 'red.100',
    debug: true,
    color: '{colors.red.400}',
    fontSize: 'token(fontSizes.2xl, 4px)',
    marginTop: '{spacings.4} token(spacing.600)',
    margin: '4',
    pt: token('sizes.4'),
  })

  const color = 'red'
  const circleSize = '4'
  const ta = 'left'
  const justify = 'center'

  return (
    <div
      className={stack({
        debug: true,
        padding: '40px',
        align: 'stretch !',
        color: '#111',
        background: 'red',
        backgroundColor: color,
        content: "['escape hatch']",
        textAlign: ta,
        justify: justify,
        _hover: {
          color: 'green.300/40',
          backgroundColor: 'green.300',
        },
      })}
    >
      <panda.a href={`mailto:${1}`} />
      <Circle size={circleSize} _hover={{ bg: 'red.200' }} />
      <HStack gap="40px" debug>
        <div className={className}>Element 1</div>
        <panda.div
          color={color}
          fontWeight="bold"
          fontSize="50px"
          bg="red.200"
          borderColor="red.500"
          borderTopColor={'#111'}
        >
          Element 2
        </panda.div>
      </HStack>
      <LocalFactoryComp debug />
    </div>
  )
}

export default App
