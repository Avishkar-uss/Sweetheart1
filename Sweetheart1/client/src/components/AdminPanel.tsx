import { useEffect, useState } from "react";

interface Complaint {
  id: number;
  message: string;
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface Hug {
  id: number;
  hug_type: string;
  count: number;
}

const AdminPanel = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hugs, setHugs] = useState<Hug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [cRes, tRes, hRes] = await Promise.all([
        fetch("/api/complaints"),
        fetch("/api/tasks"),
        fetch("/api/hugs")
      ]);

      if (!cRes.ok || !tRes.ok || !hRes.ok) throw new Error("Failed to fetch");

      const complaintsData = await cRes.json();
      const tasksData = await tRes.json();
      const hugsData = await hRes.json();

      setComplaints(complaintsData);
      setTasks(tasksData);
      setHugs(hugsData);
    } catch (err: any) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Complaints</h2>
        {complaints.length === 0 ? (
          <p className="text-gray-500 italic">No complaints yet</p>
        ) : (
          <ul className="list-disc pl-5">
            {complaints.map((c) => (
              <li key={c.id}>{c.message}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500 italic">No tasks found</p>
        ) : (
          <ul className="list-disc pl-5">
            {tasks.map((t) => (
              <li key={t.id}>
                {t.title} – {t.completed ? "✅" : "❌"}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Hugs</h2>
        {hugs.length === 0 ? (
          <p className="text-gray-500 italic">No hugs recorded</p>
        ) : (
          <ul className="list-disc pl-5">
            {hugs.map((h) => (
              <li key={h.id}>
                {h.hug_type} – {h.count}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
