import { getUser, supabaseServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function StructuralTeamPage() {
  const user = await getUser();

  // Redirect to login if there's no user or if the user is not a structural team member
  if (!user || user.role !== 'structural_team') {
    return redirect('/auth/login');
  }

  // Fetch projects assigned to this structural team member
  const { data: projects, error } = await supabaseServerClient
    .from('projects')
    .select('*')
    .eq('structural_team_id', user.id);

  // Handle errors during project fetch
  if (error) {
    console.error("Error fetching structural team projects:", error);
    return <p className="text-red-500">Error loading projects: {error.message}</p>;
  }

  // Render the list of projects or a message if no projects are found
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Assigned Structural Projects</h1>
      {projects?.length === 0 ? (
        <p>No projects assigned to you.</p>
      ) : (
        <ul className="space-y-2">
          {projects?.map((project) => (
            <li key={project.id} className="border p-4 rounded bg-white shadow">
              <h2 className="font-semibold">{project.name}</h2>
              <p>{project.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
