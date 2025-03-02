import { getJestProjectsAsync } from "@nx/jest";

export default async (): Promise<any> => ({
	projects: await getJestProjectsAsync(),
});
