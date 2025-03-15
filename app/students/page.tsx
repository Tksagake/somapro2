"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import LayoutWrapper from "../components/LayoutWrapper";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase.from("students").select("*");
      if (error) console.error("Error fetching students:", error);
      else setStudents(data);
    };

    fetchStudents();
  }, []);

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    student.first_name.toLowerCase().includes(search.toLowerCase()) ||
    student.last_name.toLowerCase().includes(search.toLowerCase()) ||
    student.admission_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LayoutWrapper>
      <div className="p-6 bg-blue-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-black">Student Management</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name or admission number..."
          className="w-full p-2 border rounded mb-4 bg-white text-gray-800"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Add Student Button */}
        <Link
          href="/students/admission"
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block hover:bg-blue-600 transition-colors"
        >
          + Admit New Student
        </Link>

        {/* Students Table */}
        <table className="w-full border-collapse border border-gray-300 mt-4 bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-black">Admission No</th>
              <th className="border p-2 text-black">Name</th>
              <th className="border p-2 text-black">Gender</th>
              <th className="border p-2 text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-100">
                <td className="border p-2 text-gray-800">{student.admission_number}</td>
                <td className="border p-2 text-gray-800">{student.first_name} {student.last_name}</td>
                <td className="border p-2 text-gray-800">{student.gender}</td>
                <td className="border p-2">
                  <Link
                    href={`/students/${student.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LayoutWrapper>
  );
}