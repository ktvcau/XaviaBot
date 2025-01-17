import { DeathType } from '../enum/index.js';
import Villager from './Villager.js';

export default class Diseased extends Villager {
	constructor(options) {
		super({
			...options,
			...{}
		});
	}

	async die(death) {
		await super.die(death);
		if (death.type == DeathType.GANG)
			await this.sendMessage('Vì bạn là người bệnh nên con sói cắn bạn sẽ không thể cắn vào đêm tiếp theo!');
	}
};
