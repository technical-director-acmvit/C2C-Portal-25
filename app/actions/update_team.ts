import { authenticatedFetch } from "@/lib/apifetch";

export type UpdateTeamInput = {
	githubUrl?: string | null;
	figmaUrl?: string | null;
	other?: string | null;
	techStack?: string[] | null;
};

export async function updateTeam(input: UpdateTeamInput) {
	const payload = {
		...(input.githubUrl !== undefined && { github_url: input.githubUrl }),
		...(input.figmaUrl !== undefined && { figma_url: input.figmaUrl }),
		...(input.other !== undefined && { other: input.other }),
		...(input.techStack !== undefined && { tech_stack: input.techStack }),
	};

	const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/team/update`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
	if (!res.ok) {
		const e = await res.json().catch(() => ({}));
		throw new Error(e.error || "Failed to update team");
	}
	return res.json();
}