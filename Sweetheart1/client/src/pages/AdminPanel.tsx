import { useEffect, useState } from "react";
import supabase from "../supabaseClient"; // adjust path as needed

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [hugs, setHugs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: c } = await supabase.from("complaints").select("*");
      const { data: t } = await supabase.from("tasks").select("*");
      const { data: h } = await supabase.from("hugs").select("*");

      setComplaints(c || []);
      setTasks(t || []);
      setHugs(h || []);
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Complaints</h2>
        <ul className="list-disc pl-5">
          {complaints.map((c) => (
            <li key={c.id}>{c.message}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <ul className="list-disc pl-5">
          {tasks.map((t) => (
            <li key={t.id}>
              {t.title} – {t.completed ? "✅" : "❌"}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Hugs</h2>
        <ul className="list-disc pl-5">
          {hugs.map((h) => (
            <li key={h.id}>
              {h.hug_type} – {h.count}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPanel;
