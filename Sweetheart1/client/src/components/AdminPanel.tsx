import { useEffect, useState } from "react";

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [hugs, setHugs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const complaintsRes = await fetch("/api/complaints");
      const complaints = await complaintsRes.json();

      const tasksRes = await fetch("/api/tasks");
      const tasks = await tasksRes.json();

      const hugsRes = await fetch("/api/hugs");
      const hugs = await hugsRes.json();

      setComplaints(complaints);
      setTasks(tasks);
      setHugs(hugs);
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Complaints</h2>
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
        <h2 className="text-xl font-semibold">Tasks</h2>
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
        <h2 className="text-xl font-semibold">Hugs</h2>
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
