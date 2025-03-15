"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { supabase } from "../../lib/supabase";
import LayoutWrapper from "../../components/LayoutWrapper";

export default function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [student, setStudent] = useState<any>(null);
  const router = useRouter();
  const { id } = use(params); // Unwrap the params Promise

  console.log("Student ID:", id); // Log the student ID

  useEffect(() => {
    const fetchStudent = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching student:", error);
        router.push("/students");
      } else {
        console.log("Fetched student data:", data); // Log the fetched data
        setStudent(data);
      }
    };

    fetchStudent();
  }, [id, router]);

  useEffect(() => {
    console.log("Component re-rendered with student data:", student);
  }, [student]);

  if (!student) {
    console.log("Loading state");
    return <div>Loading...</div>;
  }

  console.log("Rendering student details:", student);

  return (
    <LayoutWrapper>
      <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Student Details</h1>
        {student ? (
          <div className="space-y-4">
            <p><strong>Admission Number:</strong> {student.admission_number}</p>
            <p><strong>Name:</strong> {student.first_name} {student.last_name}</p>
            <p><strong>Gender:</strong> {student.gender}</p>
            <p><strong>Date of Birth:</strong> {student.date_of_birth}</p>
            <p><strong>County:</strong> {student.county}</p>
            <p><strong>Religion:</strong> {student.religion}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Phone Number:</strong> {student.phone_number}</p>
          </div>
        ) : (
          <div>No student data available</div>
        )}
      </div>
    </LayoutWrapper>
  );
}
