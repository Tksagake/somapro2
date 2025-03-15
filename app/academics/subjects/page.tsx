"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import LayoutWrapper from "@/app/components/LayoutWrapper";

export default function CreateSubjectPage() {
  const router = useRouter();
  const [subject, setSubject] = useState({ subject_name: "" });
  const [subjects, setSubjects] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubject((prevSubject) => ({ ...prevSubject, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        // Update existing subject
        const { error } = await supabase
          .from("subjects")
          .update({ subject_name: subject.subject_name })
          .eq("id", editingSubject.id);

        if (error) throw error;
      } else {
        // Insert new subject
        const { error } = await supabase.from("subjects").insert([subject]);

        if (error) throw error;
      }

      alert("Subject saved successfully!");
      fetchSubjects();
      setEditingSubject(null);
      setSubject({ subject_name: "" });
    } catch (error) {
      console.error("Error saving subject:", error.message || error);
      alert("Error saving subject: " + (error.message || "Unknown error occurred."));
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase.from("subjects").select("*");
      if (error) throw error;
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error.message || error);
    }
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setSubject({ subject_name: subject.subject_name });
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      const { error } = await supabase.from("subjects").delete().eq("id", subjectId);
      if (error) throw error;
      alert("Subject deleted successfully!");
      fetchSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error.message || error);
      alert("Error deleting subject: " + (error.message || "Unknown error occurred."));
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <LayoutWrapper>
      <div className="p-6 max-w-lg mx-auto bg-gray-100 min-h-screen text-gray-800">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Manage Subjects</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="subject_name"
            placeholder="Subject Name"
            className="w-full p-2 border rounded bg-white text-black"
            onChange={handleChange}
            value={subject.subject_name}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            {editingSubject ? "Update Subject" : "Create Subject"}
          </button>
        </form>

        {/* Table for Subjects */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Subjects</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Subject Name</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td className="border border-gray-300 p-2">{subject.subject_name}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEditSubject(subject)}
                      className="text-blue-500 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutWrapper>
  );
}
