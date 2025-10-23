// Import your utils
import { getUser, supabaseServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ArchitectProjectsPage() {
  // Get the current logged-in user
  const user = await getUser();

  // Redirect to login if there's no user or if the user is not an architect
  if (!user || user.role !== 'architect') {
    return redirect('/auth/login');
  }

  // Fetch projects based on the logged-in architect's ID
  const { data: projects, error } = await supabaseServerClient
    .from('projects')
    .select('*')
    .eq('architect_id', user.id);

  // Handle any errors that might occur during the project fetch
  if (error) {
    console.error("Error fetching projects:", error);
    return <p className="text-red-500">Error loading projects: {error.message}</p>;
  }

  // Render the list of projects or a message if no projects are found
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Projects</h1>
      {projects?.length === 0 ? (
        <p>No projects found. Please create one!</p>
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
