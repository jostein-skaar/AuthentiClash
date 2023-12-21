import { generateUniqueSentence } from '$lib/utils/word-generator/generator.js';
import { fail } from '@sveltejs/kit';

export const actions = {
	create: async ({ request, locals: { supabase, user } }) => {
		const formData = await request.formData();
		const name = formData.get('game-name');
		const endDate = formData.get('end-date');
		const endTime = formData.get('end-time');

		if (!user.data.user?.id) {
			console.log('no user id');
			return fail(401, {
				name,
				endDate,
				endTime
			});
		}
		const generatedId = generateUniqueSentence();
		const game = {
			name,
			end_at: endDate,
			code: generatedId,
			creator: user.data.user?.id,
			is_active: true,
			created_at: new Date(),
			updated_at: new Date()
		};

		const { data, error } = await supabase.from('games').insert(game).select();

		if (error) {
			return fail(500, {
				name,
				endDate,
				endTime
			});
		}

		return {
			game: data[0],
			success: true
		};
	}
};