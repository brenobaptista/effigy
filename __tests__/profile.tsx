import { render } from '../testUtils'
import Portrait from '../src/components/svgs/Portrait'

test('matches snapshot', () => {
  const { asFragment } = render(<Portrait width={128} height={128} />)

  expect(asFragment()).toMatchSnapshot()
})
