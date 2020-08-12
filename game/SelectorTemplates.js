import FreezeTemplate from './actions/freeze.mjs'
import StunTemplate from './actions/stun.mjs'
import BulletTemplate from './selectors/bullet.mjs'
import OthersTemplate from './selectors/others.mjs'

const templates = {
	actions: {
		freeze: FreezeTemplate,
		stun: StunTemplate
	},
	selectors: {
		bullet: BulletTemplate,
		others: OthersTemplate
	}
}

export default templates
