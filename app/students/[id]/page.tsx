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
        setStudent(data);
      }
    };

    if (id) fetchStudent();
  }, [id, router]);

  if (!student) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <LayoutWrapper>
      <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Student Details</h1>
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <p><strong>Admission Number:</strong> {student.admission_number}</p>
          <p><strong>Name:</strong> {student.first_name} {student.middle_name} {student.last_name}</p>
          <p><strong>Gender:</strong> {student.gender}</p>
          <p><strong>Date of Birth:</strong> {student.date_of_birth}</p>
          <p><strong>Nationality:</strong> {student.nationality}</p>
          <p><strong>County:</strong> {student.county}</p>
          <p><strong>Religion:</strong> {student.religion}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Phone Number:</strong> {student.phone_number}</p>
          <p><strong>ID Number:</strong> {student.id_number}</p>
          <p><strong>KCPE Index Number:</strong> {student.kcpe_index_number}</p>
          <p><strong>Marital Status:</strong> {student.marital_status}</p>
          <p><strong>Guardian Name:</strong> {student.guardian_name}</p>
          <p><strong>Guardian Phone:</strong> {student.guardian_phone}</p>
          <p><strong>Emergency Contact Name:</strong> {student.emergency_contact_name}</p>
          <p><strong>Emergency Contact Phone:</strong> {student.emergency_contact_phone}</p>
          <p><strong>Admission Date:</strong> {student.admission_date}</p>
          <p><strong>Grade:</strong> {student.grades?.grade_name}</p>
          <p><strong>Stream:</strong> {student.streams?.stream_name}</p>

          {student.passport_photo_url && (
            <div>
              <strong>Passport Photo:</strong>
              <img src={student.passport_photo_url} alt="Passport" className="mt-2 w-32 h-32 object-cover rounded" />
            </div>
          )}
          {student.id_document_url && (
            <div>
              <strong>ID Document:</strong>
              <a href={student.id_document_url} target="_blank" className="text-blue-600 underline">View Document</a>
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
}
